import { default as mongoose } from 'mongoose';
import {
  Controller,
  UseGuards,
  Logger,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { TokenMiddlewareGuard } from 'src/token/guard/token.guard';
import { TokenDecorator, UseToken } from 'src/token/decorator/token.decorator';
import { AuctionService } from '../service/auction.service';
import { SubmitBidDto, deployAuctionDto } from '../dto/auction.dto';
import { TokenDataDto } from 'src/token/dto/token.dto';

@Controller('auction')
@UseGuards(TokenMiddlewareGuard)
@UseToken()
export class AuctionController {
  private logger = new Logger(AuctionController.name);

  constructor(private readonly auctionService: AuctionService) { }

  @Get(':auctionId/status')
  async getAuctionStatus() { }

  @Get(':auctionId/history')
  async getAuctionBidHistory(@Param('auctionId') auctionId: string) {
    return { history: await this.auctionService.getBidHistory(auctionId) };
  }

  @Get(':auctionId/statistics')
  async getAuctionStatistics() { }

  @Post(':auctionId/submit-bid')
  async submitBid(
    @TokenDecorator() { id }: TokenDataDto,
    @Param('auctionId') auctionId: string,
    @Body() { value, from }: SubmitBidDto,
  ) {
    const auction = await this.auctionService.findByIdOrErrorOut(auctionId);
    const bid = await this.auctionService.makeBid(id, auction, from, value);

    auction.highestBid = bid._id;
    await auction.save();
    return {
      auction: await auction.populate({ path: 'highestBid', populate: 'user' }),
    };
  }

  @Post('/deploy')
  async deployAuctionContract(
    @Body()
    { deployerAddress, beneficiaryAddress, biddingDuration }: deployAuctionDto,
  ) {
    const auction = await this.auctionService.deployContract(
      deployerAddress,
      beneficiaryAddress,
      biddingDuration,
    );
    return { auction };
  }
}
