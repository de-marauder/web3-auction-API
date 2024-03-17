import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { Auction } from '../schema/auction.schema';
import { BidService } from '../service/bid.service';
import { BaseService } from 'src/database/service/db.service';
import { Web3Service } from 'src/web3/service/web3.service';
import * as AuctionContract from '../abi/SimpleAuction.json';
import { AUCTION_CONTRACT_GAS } from '../enum/auction.enum';

@Injectable()
export class AuctionService extends BaseService<Auction> {
  private logger = new Logger(AuctionService.name);

  constructor(
    @InjectModel(Auction.name)
    private readonly AuctionModel: Model<Auction>,
    private readonly bidService: BidService,
    private readonly web3Service: Web3Service,
  ) {
    super(AuctionModel);
  }

  async deployContract(
    deployerAddress: string,
    beneficiaryAddress: string,
    biddingDuration: string,
  ) {
    const bytecode = AuctionContract.bytecode;
    const contract = new this.web3Service.web3.eth.Contract(
      AuctionContract.abi,
    );
    const biddingTime = this.bidService.parsebiddingTime(biddingDuration);
    const contractArguments = [biddingTime, beneficiaryAddress];
    await contract
      .deploy({
        data: bytecode,
        arguments: contractArguments,
      })
      .send({ from: deployerAddress, gas: AUCTION_CONTRACT_GAS.DEPLOYMENT_FEE })
      .catch((error) => {
        this.logger.log(error);
        throw error;
      });

    return await this.AuctionModel.create({
      contractAddress: contract.options.address,
      beneficiaryAddress,
      endTime: `${biddingTime}`, // save as string
    });
  }

  async getStatus() { }
  async getBidHistory() { }
}
