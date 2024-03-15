import { User } from 'src/user/schema/user.schema';

export type LoginUserDto = Pick<User, 'password' | 'email'>;
export type RegisterUserDto = Pick<User, 'password' | 'email'> &
  Partial<Pick<User, 'username' | 'avatar'>>;
