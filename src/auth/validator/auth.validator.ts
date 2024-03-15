import * as Joi from 'joi';
import { RegisterUserDto } from '../dto/auth.dto';
import {
  emailValidator,
  passwordValidator,
  urlValidator,
} from 'src/utils/validator/custom.validator';

export const RegisterUserDtoValidator = Joi.object<RegisterUserDto>({
  email: emailValidator.required(),
  password: passwordValidator.required(),
  username: Joi.string().trim(),
  avatar: urlValidator.trim(),
});

export const LoginUserDtoValidator = Joi.object<RegisterUserDto>({
  email: emailValidator.required(),
  password: passwordValidator.required(),
});
