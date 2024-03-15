import * as Joi from 'joi';
import {
  emailValidator,
  objectIdValidator,
} from 'src/utils/validator/custom.validator';
import { TokenDataDto } from '../dto/token.dto';

export const TokenDataDtoValidator = Joi.object<TokenDataDto>({
  id: objectIdValidator.required(),
  email: emailValidator.required(),
  username: Joi.string().required(),
});
