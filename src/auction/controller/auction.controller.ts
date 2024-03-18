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
import {
  ObjectValidationPipe,
  StringValidationPipe,
} from 'src/utils/pipe/validation.pipe';
import {
  DeployAuctionDtoValidator,
  SubmitBidDtoValidator,
} from '../validator/auction.validator';
import { objectIdValidator } from 'src/utils/validator/custom.validator';

@Controller('auction')
@UseGuards(TokenMiddlewareGuard)
@UseToken()
export class AuctionController {
  private logger = new Logger(AuctionController.name);

  constructor(private readonly auctionService: AuctionService) { }

  @Get(':auctionId/status')
  async getAuctionStatus(
    @Param('auctionId', new StringValidationPipe(objectIdValidator))
    auctionId: string,
  ) {
    const data = await this.auctionService.getStatus(auctionId);
    return { data };
  }

  @Get(':auctionId/history')
  async getAuctionBidHistory(
    @Param('auctionId', new StringValidationPipe(objectIdValidator))
    auctionId: string,
  ) {
    return { history: await this.auctionService.getBidHistory(auctionId) };
  }

  @Get(':auctionId/statistics')
  async getAuctionStatistics(
    @Param('auctionId', new StringValidationPipe(objectIdValidator))
    auctionId: string,
  ) {
    const data = await this.auctionService.getStatistics(auctionId);
    return {
      auctionStats: {
        totalETHVolume: data[0].totalETHVolume,
        numberOfBids: data[0].numberOfBids,
      },
    };
  }

  @Post(':auctionId/submit-bid')
  async submitBid(
    @TokenDecorator() { id }: TokenDataDto,
    @Param('auctionId', new StringValidationPipe(objectIdValidator))
    auctionId: string,
    @Body(new ObjectValidationPipe(SubmitBidDtoValidator))
    { value, from }: SubmitBidDto,
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
    @Body(new ObjectValidationPipe(DeployAuctionDtoValidator))
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
