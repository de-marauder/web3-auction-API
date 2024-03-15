import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { dbSchemaOptions } from 'src/database/config/db.config';

@Schema(dbSchemaOptions)
export class User {
  @Prop({ type: String, default: '' })
  avatar: string;

  @Prop({ type: String })
  username: string;

  @Prop({ type: String, index: true })
  email: string;

  @Prop({ type: String, required: true, select: false })
  password: string;

  @Prop({ type: Boolean, default: false })
  activated: boolean;

  @Prop({ type: String, default: '' })
  verificationCode: string;

  @Prop({ type: Boolean, default: false, select: false })
  deleted: boolean;

  @Prop({ type: Boolean, default: false, select: false })
  loggedIn: boolean;
}

export type UserDocument = User & mongoose.Document;

export const UserSchema = SchemaFactory.createForClass(User);
