import * as Joi from 'joi';
import { Types } from 'mongoose';

export const emailValidator = Joi.string().trim().email().lowercase();

export const stringValidator = Joi.string().trim();

export const numberValidator = Joi.number();

export const arrayValidator = Joi.array();

export const urlValidator = Joi.string()
  .trim()
  .regex(
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/i,
  )
  .error(() => new Error('please provide a valid link'));

export const passwordValidator = Joi.string()
  .trim()
  .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
  .error(
    new Joi.ValidationError(
      'please provide a strong password. (Alphanumeric + symbol + at least 8 characters)',
      [],
      null,
    ),
  );

export const objectIdValidator = Joi.string()
  .trim()
  .custom((value, helpers) => {
    if (Types.ObjectId.isValid(value)) {
      return value;
    }
    return helpers.message({
      '*': `${value} is not a valid objectId`,
    });
  });

export const customObjectIdValidator = Joi.custom((value, helpers) => {
  if (Types.ObjectId.isValid(value)) {
    return value;
  }
  return helpers.message({
    '*': `${value} is not a valid objectId`,
  });
});
