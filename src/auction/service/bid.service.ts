import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from 'src/database/service/db.service';
import { Bid } from '../schema/bid.schema';

@Injectable()
export class BidService extends BaseService<Bid> {
  private logger = new Logger(BidService.name);

  constructor(@InjectModel(Bid.name) private readonly BidModel: Model<Bid>) {
    super(BidModel);
  }

  async makeBid() { }

  async getHighestBid() { }

  async getStatistics() { }
}
