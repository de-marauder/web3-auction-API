import { Controller, UseGuards, Logger, Get, Post, Body } from '@nestjs/common';
import { TokenMiddlewareGuard } from 'src/token/guard/token.guard';
import { UseToken } from 'src/token/decorator/token.decorator';
import { AuctionService } from '../service/auction.service';
import { deployAuctionDto } from '../dto/auction.dto';

@Controller('auction')
@UseGuards(TokenMiddlewareGuard)
@UseToken()
export class AuctionController {
  private logger = new Logger(AuctionController.name);

  constructor(private readonly auctionService: AuctionService) { }

  @Get(':auctionId/status')
  async getAuctionStatus() { }

  @Get(':auctionId/history')
  async getAuctionBidHistory() { }

  @Get(':auctionId/statistics')
  async getAuctionStatistics() { }

  @Post(':auctionId/submit-bid')
  async submitBid() { }

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
