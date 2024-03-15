import { Body, Controller, Delete, Logger, Post } from '@nestjs/common';
import { randomSixDigits } from 'src/utils/functions/utils.functions';
import { LoginUserDto, RegisterUserDto } from '../dto/auth.dto';
import { TokenDecorator } from 'src/token/decorator/token.decorator';
import { TokenDataDto } from 'src/token/dto/token.dto';
import {
  LoginUserDtoValidator,
  RegisterUserDtoValidator,
} from '../validator/auth.validator';
import { ObjectValidationPipe } from 'src/utils/pipe/validation.pipe';
import { TokenDataDtoValidator } from 'src/token/validator/token.validator';
import { AuthService } from '../service/auth.service';
import { TokenService } from 'src/token/service/token.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) { }

  @Post('register')
  async register(
    @Body(new ObjectValidationPipe(RegisterUserDtoValidator))
    registerUserDto: RegisterUserDto,
  ) {
    const verificationCode = randomSixDigits();

    const user = await this.authService.register({
      ...registerUserDto,
      code: verificationCode,
    });

    return { user };
  }

  @Post('login')
  async login(
    @Body(new ObjectValidationPipe(LoginUserDtoValidator))
    { email, password }: LoginUserDto,
  ) {
    const user = await this.authService.verifyPassword({ email, password });
    const token = await this.tokenService.signToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });
    user.loggedIn = true;
    await user.save();
    return { user, token };
  }

  @Delete('logout')
  async logout(
    @TokenDecorator(new ObjectValidationPipe(TokenDataDtoValidator))
    { id }: TokenDataDto,
  ) {
    await this.authService.logout(id);
    return 'logged out';
  }
}
