import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuctionService } from './service/auction.service';
import { BidService } from './service/bid.service';
import { AuctionController } from './controller/auction.controller';
import { BidModel } from './model/bid.model';
import { AuctionModel } from './model/auction.model';
import { UserService } from 'src/user/service/user.service';
import { UserModel } from 'src/user/model/user.model';

@Module({
  providers: [AuctionService, BidService, UserService],
  controllers: [AuctionController],
  imports: [
    MongooseModule.forFeatureAsync([AuctionModel, BidModel, UserModel]),
  ],
  exports: [MongooseModule.forFeatureAsync([AuctionModel, BidModel])],
})
export class AuctionModule { }
