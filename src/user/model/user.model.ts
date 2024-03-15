import { User, UserSchema } from '../schema/user.schema';

export const UserModel = {
  name: User.name,
  useFactory: () => UserSchema,
};
