import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserModel } from './model/user.model';
import { TokenService } from 'src/token/service/token.service';

@Module({
  controllers: [UserController],
  providers: [UserService, TokenService],
  imports: [MongooseModule.forFeatureAsync([UserModel])],
  exports: [UserService, MongooseModule.forFeatureAsync([UserModel])],
})
export class UserModule { }
