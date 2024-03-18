import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { envValidator } from './env/validator/env.validator';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RequestLoggerMiddleware } from './utils/middleware/requestLogger.middleware';
import { TokenMiddleware } from './token/middleware/token.middleware';
import { TokenModule } from './token/token.module';
import { AuctionModule } from './auction/auction.module';
import { Web3Module } from './web3/web3.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: envValidator,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    TokenModule,
    AuctionModule,
    Web3Module,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
    consumer
      .apply(TokenMiddleware)
      .exclude(
        { path: '/', method: RequestMethod.GET },
        { path: '/health', method: RequestMethod.GET },
        { path: '/auth/register', method: RequestMethod.POST },
        { path: '/auth/login', method: RequestMethod.POST },
        { path: '/user/verify', method: RequestMethod.POST },
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}
