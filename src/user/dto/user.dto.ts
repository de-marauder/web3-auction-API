import { RegisterUserDto } from 'src/auth/dto/auth.dto';
import { User } from '../schema/user.schema';

export type CreateUserDto = RegisterUserDto & Pick<User, 'verificationCode'>;
