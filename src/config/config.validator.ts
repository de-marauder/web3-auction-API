import * as Joi from 'joi';
import { EnvConfigEnum } from './env.enum';
import { envValidator } from 'src/env/validator/env.validator';

export const envConfigValidator = envValidator.append({
  [EnvConfigEnum.PORT]: Joi.number().required(),
  [EnvConfigEnum.TOKEN_SECRET]: Joi.string().required(),
  [EnvConfigEnum.DEV_DATABASE]: Joi.string().required(),
  [EnvConfigEnum.TEST_DATABASE]: Joi.string().required(),
  [EnvConfigEnum.JWT_EXPIRE]: Joi.number(),
});
