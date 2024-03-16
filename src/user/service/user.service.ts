import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { User } from '../schema/user.schema';
import { BaseService } from 'src/database/service/db.service';
import { CreateUserDto, VerifyUserDto } from '../dto/user.dto';
import { generateUniqueString } from 'src/utils/functions/utils.functions';
import { hash } from 'src/utils/functions/password.function';

@Injectable()
export class UserService extends BaseService<User> {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name)
    private readonly UserModel: Model<User>,
  ) {
    super(UserModel);
  }

  async createUser(dto: CreateUserDto) {
    dto.password = await hash(dto.password);
    dto.username = dto.username || `user-${generateUniqueString(4)}`;
    return await this.create(dto);
  }

  async verify({ email, code }: VerifyUserDto) {
    const user = await this.findOneOrErrorOut({ email });

    if (user.verificationCode !== `${code}`) {
      throw new BadRequestException();
    }

    user.activated = true;
    user.verificationCode = '';
    user.loggedIn = true;
    await user.save();

    return user;
  }
}
