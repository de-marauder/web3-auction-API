import * as express from 'express';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { envConfigValidator } from './config/config.validator';
import { EnvConfigEnum } from './config/env.enum';
import { GlobalExceptionsFilter } from './utils/exception/global.exception';
import { GlobalResponseInterceptor } from './utils/interceptor/global.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionsFilter(httpAdapter));

  app.enableCors();
  /**To support payload with large size */
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  await envConfigValidator.validateAsync(process.env, {
    stripUnknown: true,
  });

  const configService = app.get(ConfigService);

  const port = configService.get<number>(EnvConfigEnum.PORT);
  app.setGlobalPrefix('api/v1');

  app.useGlobalInterceptors(new GlobalResponseInterceptor());
  await app.listen(port || 3000);
  Logger.debug(`listening on port ${port}`);
}
bootstrap();
