import { Controller, UseGuards, Logger, Get, Post } from '@nestjs/common';
import { TokenMiddlewareGuard } from 'src/token/guard/token.guard';
import { UseToken } from 'src/token/decorator/token.decorator';

@Controller('auction')
@UseGuards(TokenMiddlewareGuard)
@UseToken()
export class AuctionController {
  private logger = new Logger(AuctionController.name);

  @Get(':auctionId/status')
  async getAuctionStatus() { }

  @Get(':auctionId/status')
  async getAuctionBidHistory() { }

  @Get(':auctionId/statistics')
  async getAuctionStatistics() { }

  @Post(':auctionId/submit-bid')
  async submitBid() { }
}
