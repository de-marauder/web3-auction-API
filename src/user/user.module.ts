import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserModel } from './model/user.model';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [MongooseModule.forFeatureAsync([UserModel])],
  exports: [MongooseModule.forFeatureAsync([UserModel])],
})
export class UserModule {}
