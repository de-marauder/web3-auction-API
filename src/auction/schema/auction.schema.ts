import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { dbSchemaOptions } from 'src/database/config/db.config';
import { Bid } from './bid.schema';

@Schema(dbSchemaOptions)
export class Auction {
  @Prop({ type: String })
  contractAddress: string;

  @Prop({ type: String })
  beneficiaryAddress: string;

  @Prop({ type: mongoose.SchemaTypes.ObjectId, default: null, ref: 'Bid' })
  highestBid: Bid | mongoose.Types.ObjectId;

  @Prop({ type: String })
  endTime: string;

  @Prop({ type: Boolean, default: false })
  ended: boolean;
}

export type AuctionDocument = Auction & mongoose.Document;

export const AuctionSchema = SchemaFactory.createForClass(Auction);
