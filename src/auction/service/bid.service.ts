import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { BaseService } from 'src/database/service/db.service';
import { Bid } from '../schema/bid.schema';
import { TimeUnits } from 'src/utils/enums/utils.enums';

@Injectable()
export class BidService extends BaseService<Bid> {
  private logger = new Logger(BidService.name);

  constructor(@InjectModel(Bid.name) private readonly BidModel: Model<Bid>) {
    super(BidModel);
  }

  async makeBid() { }

  async getHighestBid() { }

  async getStatistics() { }

  parsebiddingTime(time: string) {
    const lastChar = time[time.length - 1];
    this.logger.log('typeof time: ', typeof time);
    this.logger.log('lastChar: ', lastChar);
    const validLastChars = ['s', 'm', 'h', 'd', 'w', 'M', 'Y'];
    if (isNaN(+lastChar) && !validLastChars.includes(lastChar)) {
      throw new BadRequestException(
        'Invalid bid time. Only s, m, h, d, w, M, Y are vaild time units',
      );
    }
    const timeWithoutLastChar = +time.slice(0, time.length - 1);
    this.logger.log('timeWithoutLastChar: ', timeWithoutLastChar);
    this.logger.log('typeof timeWithoutLastChar: ', typeof timeWithoutLastChar);
    if (isNaN(timeWithoutLastChar)) {
      throw new BadRequestException(
        'Invalid bid time. Values before a unit (if passed) should be a valid number'
      );
    }
    let biddingTime: number;
    const now = Date.now();
    switch (lastChar) {
      case 's':
        biddingTime = now + timeWithoutLastChar * TimeUnits.SECOND;
        break;
      case 'm':
        biddingTime = now + timeWithoutLastChar * TimeUnits.MINUTE;
        break;
      case 'h':
        biddingTime = now + timeWithoutLastChar * TimeUnits.HOUR;
        break;
      case 'd':
        biddingTime = now + timeWithoutLastChar * TimeUnits.DAY;
        break;
      case 'w':
        biddingTime = now + timeWithoutLastChar * TimeUnits.WEEK;
        break;
      case 'M':
        biddingTime = now + timeWithoutLastChar * TimeUnits.SECOND;
        break;
      case 'Y':
        biddingTime = now + timeWithoutLastChar * TimeUnits.SECOND;
        break;
      default:
        if (isNaN(+time)) throw new BadRequestException('Invalid bid time');
        biddingTime = now + +time; // default to milliseconds
        break;
    }
    return biddingTime;
  }
}
