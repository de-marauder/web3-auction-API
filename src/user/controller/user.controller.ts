import { Body, Controller, Logger, Post } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { VerifyUserDto } from '../dto/user.dto';
import { TokenService } from 'src/token/service/token.service';
import { ObjectValidationPipe } from 'src/utils/pipe/validation.pipe';
import { VerifyUserDtoValidator } from '../validator/user.validator';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) { }

  @Post('verify')
  async verifyUser(
    @Body(new ObjectValidationPipe(VerifyUserDtoValidator))
    { email, code }: VerifyUserDto,
  ) {
    const user = await this.userService.verify({ email, code });
    const token = await this.tokenService.signToken({
      email: user.email,
      username: user.username,
      id: user.id,
    });

    return { user, token };
  }
}
