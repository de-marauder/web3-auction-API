import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { User } from '../schema/user.schema';
import { BaseService } from 'src/database/service/db.service';
import { CreateUserDto } from '../dto/user.dto';
@Injectable()
export class UserService extends BaseService<User> {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name)
    private readonly UserModel: Model<User>,
  ) {
    super(UserModel);
  }

  async createUser(data: CreateUserDto) {
    return await this.UserModel.create(data);
  }
}
