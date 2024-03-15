import { User } from 'src/user/schema/user.schema';

export type RegisterUserDto = Pick<User, 'password' | 'email'> &
  Partial<Pick<User, 'username' | 'avatar'>>;
