import * as Joi from 'joi';
import { emailValidator } from 'src/utils/validator/custom.validator';
import { VerifyUserDto } from '../dto/user.dto';

export const VerifyUserDtoValidator = Joi.object<VerifyUserDto>({
  email: emailValidator.required(),
  code: Joi.number().min(100000).max(999999).required(),
});
