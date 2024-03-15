import { SchemaOptions } from '@nestjs/mongoose';

export const dbSchemaOptions: SchemaOptions = {
  id: true,
  versionKey: false,
  timestamps: true,
  autoIndex: true,
  toJSON: {
    virtuals: true,
    getters: true,
    transform: (_, ret) => {
      delete ret._id;
      delete ret.password;
      delete ret.salt;
      delete ret.secret;
      delete ret.code;
      delete ret.pin;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    getters: true,
    transform: (_, ret) => {
      delete ret._id;
      delete ret.password;
      delete ret.salt;
      delete ret.secret;
      delete ret.code;
      delete ret.pin;
      return ret;
    },
  },
};
