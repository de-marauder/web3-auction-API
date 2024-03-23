import { EnvConfigEnum } from './env.enum';
import { envValidator } from 'src/env/validator/env.validator';
import {
  numberValidator,
  stringValidator,
  urlValidator,
} from 'src/utils/validator/custom.validator';

export const envConfigValidator = envValidator.append({
  [EnvConfigEnum.PORT]: numberValidator.required(),
  [EnvConfigEnum.TOKEN_SECRET]: stringValidator.required(),
  [EnvConfigEnum.DEV_DATABASE]: stringValidator.required(),
  [EnvConfigEnum.TEST_DATABASE]: stringValidator.required(),
  [EnvConfigEnum.JWT_EXPIRE]: numberValidator.required(),
  [EnvConfigEnum.WEB3_PROVIDER_URL]: urlValidator.required(),
});
