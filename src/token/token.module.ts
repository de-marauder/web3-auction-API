import { Global, Module } from '@nestjs/common';
import { TokenService } from './service/token.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/service/user.service';
import { UserModule } from 'src/user/user.module';

@Global()
@Module({
  providers: [TokenService, ConfigService, UserService],
  exports: [TokenService],
  imports: [ConfigModule, UserModule],
})
export class TokenModule { }
