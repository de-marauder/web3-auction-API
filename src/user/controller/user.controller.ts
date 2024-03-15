import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
} from '@nestjs/common';

import { UserService } from '../service/user.service';
import { VerifyUserDto } from '../dto/user.dto';
import { TokenService } from 'src/token/service/token.service';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) { }

  @Post('verify')
  async verifyUser(
    @Body()
    { email, code }: VerifyUserDto,
  ) {
    const user = await this.userService.findOneOrErrorOut({ email });

    if (user.verificationCode !== code) {
      throw new BadRequestException();
    }

    user.activated = true;
    user.verificationCode = '';
    user.loggedIn = true;

    const token = await this.tokenService.signToken({
      email: user.email,
      username: user.username,
      id: user.id,
    });

    await user.save();
    return { user, token };
  }
}
