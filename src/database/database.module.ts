import { Global, Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvConfigEnum } from '../config/env.enum';
import { DatabaseService } from './service/database.service';
import { EnvTypeEnum } from 'src/env/enum/env.enum';

@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const env = configService.getOrThrow<EnvTypeEnum>(
          EnvConfigEnum.NODE_ENV,
        );
        let uri: string;
        switch (env) {
          case EnvTypeEnum.Dev:
            uri = configService.getOrThrow<string>(EnvConfigEnum.DEV_DATABASE);
            break;
          case EnvTypeEnum.Production:
            uri = configService.getOrThrow<string>(
              EnvConfigEnum.PRODUCTION_DATABASE,
            );
            break;
          default:
            uri = configService.getOrThrow<string>(EnvConfigEnum.TEST_DATABASE);
        }
        Logger.log({ uri });
        return { uri, autoIndex: true };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule { }
