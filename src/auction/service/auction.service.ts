import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { Auction } from '../schema/auction.schema';
import { BidService } from '../service/bid.service';
import { BaseService } from 'src/database/service/db.service';

@Injectable()
export class AuctionService extends BaseService<Auction> {

  private logger = new Logger(AuctionService.name);

  constructor(
    @InjectModel(Auction.name)
    private readonly AuctionModel: Model<Auction>,
    private readonly bidService: BidService,
  ) {
    super(AuctionModel);
  }

  async deployNewContract() { }

  async getBidHistory() { }

  async getStatus() { }

}
