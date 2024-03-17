import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { dbSchemaOptions } from 'src/database/config/db.config';
import { Auction } from './auction.schema';
import { User } from 'src/user/schema/user.schema';

@Schema(dbSchemaOptions)
export class Bid {
  @Prop({ type: String })
  auctionId: string;

  @Prop({
    type: mongoose.SchemaTypes.ObjectId,
    ref: Auction.name,
  })
  auction: Auction | mongoose.Types.ObjectId;

  @Prop({ type: String })
  bidderAddress: string;

  @Prop({ type: String })
  userId: string;

  @Prop({
    type: mongoose.SchemaTypes.ObjectId,
    ref: User.name,
  })
  user: User | mongoose.Types.ObjectId;

  @Prop({ type: String })
  bidAmount: number;
}

export type BidDocument = Bid & mongoose.Document;

export const BidSchema = SchemaFactory.createForClass(Bid);
