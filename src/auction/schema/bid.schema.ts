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
    ref: 'Auction',
  })
  auction: Auction | mongoose.Types.ObjectId;

  @Prop({ type: String })
  transactionHash: string;

  @Prop({ type: String })
  bidderAddress: string;

  @Prop({ type: String })
  userId: string;

  @Prop({
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  })
  user: User | mongoose.Types.ObjectId;

  @Prop({ type: String })
  bidAmount: string;
}

export type BidDocument = Bid & mongoose.Document;

export const BidSchema = SchemaFactory.createForClass(Bid);
