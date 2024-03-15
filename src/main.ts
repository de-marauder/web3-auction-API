import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { envConfigValidator } from './config/config.validator';
import { EnvConfigEnum } from './config/env.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await envConfigValidator.validateAsync(process.env, {
    stripUnknown: true,
  });

  const configService = app.get(ConfigService);

  const port = configService.get<number>(EnvConfigEnum.PORT);

  await app.listen(port || 3000);
  Logger.debug(`listening on port ${port}`);
}
bootstrap();
