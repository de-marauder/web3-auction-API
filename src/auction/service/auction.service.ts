import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Auction, AuctionDocument } from '../schema/auction.schema';
import { BidService } from '../service/bid.service';
import { BaseService } from 'src/database/service/db.service';
import { Web3Service } from 'src/web3/service/web3.service';
import * as AuctionContract from '../abi/SimpleAuction.json';
import { AUCTION_CONTRACT_GAS } from '../enum/auction.enum';
import { Errors } from 'src/utils/enums/utils.enums';
import { ContractExecutionError } from 'web3';
import { Web3ValidatorError } from 'web3-validator';

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
    const deployedContract = await contract
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
      contractAddress: deployedContract.options.address,
      beneficiaryAddress,
      endTime: await deployedContract.methods.auctionEndTime().call(),
    });
  }

  async makeBid(
    userId: string,
    auction: AuctionDocument,
    from: string,
    value: string,
  ) {
    const contract = new this.web3Service.web3.eth.Contract(
      AuctionContract.abi,
      auction.contractAddress,
    );

    try {
      const receipt = await contract.methods.bid().send({
        from,
        value: this.web3Service.web3.utils.toWei(value, 'ether'),
        gas: AUCTION_CONTRACT_GAS.DEPLOYMENT_FEE,
      });

      const bid = await this.bidService.create({
        auctionId: auction.id,
        auction: auction._id,
        transactionHash: receipt.transactionHash,
        bidderAddress: receipt.from,
        userId,
        user: new Types.ObjectId(userId),
        bidAmount: value,
      });

      return bid;
    } catch (error) {
      if (error instanceof ContractExecutionError) {
        if (error.innerError.message.includes(Errors.AUCTION_HAS_HIGHER_BID)) {
          throw new BadRequestException(Errors.AUCTION_HAS_HIGHER_BID);
        }
        if (error.innerError.message.includes(Errors.AUCTION_HAS_ENDED)) {
          throw new BadRequestException(Errors.AUCTION_HAS_ENDED);
        }
      }
      if (error instanceof Web3ValidatorError) {
        console.log('errors: ', error.errors);
        if (error.errors[0].params['value'] === undefined) {
          throw new BadRequestException(Errors.AUCTION_BID_VALUE_INVALID);
        }
      }
      throw error;
    }
  }
  async getStatus() { }

  async getBidHistory(auctionId: string) {
    const bids = await this.bidService.find({ auctionId }, [
      { path: 'auction user' },
    ]);

    return bids;
  }
}
