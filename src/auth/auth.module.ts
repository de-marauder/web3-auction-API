import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { UserService } from 'src/user/service/user.service';
import { UserModel } from 'src/user/model/user.model';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService],
  imports: [MongooseModule.forFeatureAsync([UserModel])],
})
export class AuthModule {}
