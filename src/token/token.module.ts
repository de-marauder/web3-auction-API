import { Global, Module } from '@nestjs/common';
import { TokenService } from './service/token.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [TokenService, ConfigService],
  exports: [TokenService],
  imports: [ConfigModule],
})
export class TokenModule { }
