import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/service/user.service';
import { LoginUserDto, RegisterUserDto } from '../dto/auth.dto';
import { verifyHash } from 'src/utils/functions/password.function';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private userService: UserService) { }

  async register({
    code,
    ...createUserDto
  }: RegisterUserDto & { code: string }) {
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
    const user = await this.userService.createUser({
      ...createUserDto,
      verificationCode: code,
    });
    return user;
  }

  async verifyPassword({ email, password }: LoginUserDto) {
    const user = await this.userService.findOneOrErrorOut({ email });
    if (!(await verifyHash(user.password, password))) {
      throw new BadRequestException('Incorrect password');
    }
    return user;
  }

  async logout(id: string) {
    const user = await this.userService.findByIdOrErrorOut(id);
    user.loggedIn = false;
    await user.save();
  }
}
