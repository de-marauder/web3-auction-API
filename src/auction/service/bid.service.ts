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

    if (isNaN(timeWithoutLastChar)) {
      throw new BadRequestException(
        'Invalid bid time. Values before a unit (if passed) should be a valid number',
      );
    }
    let biddingTime: number;
    switch (lastChar) {
      case 's':
        biddingTime = timeWithoutLastChar * TimeUnits.SECOND;
        break;
      case 'm':
        biddingTime = timeWithoutLastChar * TimeUnits.MINUTE;
        break;
      case 'h':
        biddingTime = timeWithoutLastChar * TimeUnits.HOUR;
        break;
      case 'd':
        biddingTime = timeWithoutLastChar * TimeUnits.DAY;
        break;
      case 'w':
        biddingTime = timeWithoutLastChar * TimeUnits.WEEK;
        break;
      case 'M':
        biddingTime = timeWithoutLastChar * TimeUnits.MONTH;
        break;
      case 'Y':
        biddingTime = timeWithoutLastChar * TimeUnits.YEAR;
        break;
      default:
        if (isNaN(+time)) throw new BadRequestException('Invalid bid time');
        biddingTime = +time; // default to seconds
        break;
    }
    return biddingTime;
  }
}
