import { Bid, BidSchema } from '../schema/bid.schema';

export const BidModel = {
  name: Bid.name,
  useFactory: () => BidSchema,
};
