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
import { RegisterUserDto } from '../dto/auth.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly userService: UserService) { }

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
  async login() { }

  @Delete('logout')
  async logout() { }
}
