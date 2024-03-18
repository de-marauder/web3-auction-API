import { Auction, AuctionSchema } from '../schema/auction.schema';

export const AuctionModel = {
  name: Auction.name,
  useFactory: () => AuctionSchema,
};
