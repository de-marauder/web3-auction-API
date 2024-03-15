import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Logger,
  Post,
} from '@nestjs/common';
import { UserService } from 'src/user/service/user.service';
import { randomSixDigits } from 'src/utils/functions/utils.functions';
import { LoginUserDto, RegisterUserDto } from '../dto/auth.dto';
import { verifyHash } from 'src/utils/functions/password.function';
import { TokenService } from 'src/token/service/token.service';
import { TokenDecorator } from 'src/token/decorator/token.decorator';
import { TokenDataDto } from 'src/token/dto/token.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) { }

  @Post('register')
  async register(@Body() createUserDto: RegisterUserDto) {
    // Accept email and password
    if (!createUserDto.email || !createUserDto.password) {
      throw new BadRequestException();
    }
    const exists = await this.userService.model.findOne({
      $or: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });
    if (exists) {
      throw new BadRequestException(
        'User with email or username already exists',
      );
    }
    const verificationCode = randomSixDigits();
    const user = await this.userService.createUser({
      ...createUserDto,
      verificationCode,
    });
    return { user };
  }

  @Post('login')
  async login(@Body() { email, password }: LoginUserDto) {
    if (!email || !password) {
      throw new BadRequestException('Required email or password');
    }
    const user = await this.userService.findOneOrErrorOut({ email });
    if (!(await verifyHash(user.password, password))) {
      throw new BadRequestException('Incorrect password');
    }
    const token = await this.tokenService.signToken({
      email: user.email,
      username: user.username,
      id: user.id,
    });
    user.loggedIn = true;
    await user.save();
    return { user, token };
  }

  @Delete('logout')
  async logout(@TokenDecorator() { id }: TokenDataDto) {
    const user = await this.userService.findByIdOrErrorOut(id);
    user.loggedIn = false;
    await user.save();
  }
}
