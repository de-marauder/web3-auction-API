import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { dbSchemaOptions } from 'src/database/config/db.config';
import { Bid } from './bid.schema';

@Schema(dbSchemaOptions)
export class Auction {
  @Prop({ type: String })
  contractAddress: string;

  @Prop({ type: String })
  BeneficiaryAddress: string;

  @Prop({ type: mongoose.SchemaTypes.ObjectId, ref: 'bid' })
  highestBid: Bid | mongoose.Types.ObjectId;

  @Prop({ type: String, default: false })
  endTime: string;

  @Prop({ type: Boolean, default: false })
  ended: boolean;
}

export type AuctionDocument = Auction & mongoose.Document;

export const AuctionSchema = SchemaFactory.createForClass(Auction);
