import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Auction, AuctionDocument } from '../schema/auction.schema';
import { BidService } from '../service/bid.service';
import { BaseService } from 'src/database/service/db.service';
import { Web3Service } from 'src/web3/service/web3.service';
import * as AuctionContract from '../abi/SimpleAuction.json';
import { AUCTION_CONTRACT_GAS } from '../enum/auction.enum';
import { Errors, TimeUnits } from 'src/utils/enums/utils.enums';
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

  async requestUnsignedDeployContractTransaction(
    beneficiaryAddress: string,
    biddingDuration: string,
  ) {
    const bytecode = AuctionContract.bytecode;
    const biddingTime = this.bidService.parsebiddingTime(biddingDuration);
    const contractArguments = [biddingTime, beneficiaryAddress];
    const unsignedTx =
      await this.web3Service.requestUnsignedDeployContractTransaction(
        bytecode,
        AuctionContract.abi,
        contractArguments,
      );
    return unsignedTx;
  }

  async deploySignedContractTransaction(creator: string, signedTx: string) {
    const txReceipt =
      await this.web3Service.getReceiptWithSignedTransaction(signedTx);

    const deployedAddress = txReceipt.contractAddress;

    const deployedContract = this.web3Service.getContract(
      AuctionContract.abi,
      deployedAddress,
    );
    return await this.AuctionModel.create({
      creator,
      contractAddress: deployedAddress,
      beneficiaryAddress: `${await deployedContract.methods.beneficiary().call()}`,
      endTime: this.getTimeString(
        await deployedContract.methods.auctionEndTime().call(),
      ),
    });
  }

  async requestUnsignedBid(auction: AuctionDocument) {
    const contract = this.web3Service.getContract(
      AuctionContract.abi,
      auction.contractAddress,
    );
    try {
      const receipt = contract.methods.bid();
      return await this.web3Service.requestUnsignedTransaction(receipt);
    } catch (error) {
      this.logger.error(error);
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

  async saveSignedBid(
    userId: string,
    auctionId: string,
    signedTx: string,
    bidValue: string,
  ) {
    const txReceipt =
      await this.web3Service.getReceiptWithSignedTransaction(signedTx);

    // const deployedAddress = txReceipt.contractAddress;

    // const deployedContract = this.web3Service.getContract(
    //   AuctionContract.abi,
    //   deployedAddress,
    // );
    const bid = await this.bidService.create({
      auctionId: auctionId,
      auction: new Types.ObjectId(auctionId),
      transactionHash: txReceipt.transactionHash as string,
      bidderAddress: txReceipt.from,
      userId,
      user: new Types.ObjectId(userId),
      bidAmount: bidValue, // await deployedContract.methods.highestBid().call(),
    });

    return bid;
  }

  async makeBid(
    userId: string,
    auction: AuctionDocument,
    from: string,
    value: string,
  ) {
    const contract = this.web3Service.getContract(
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

  async hasEnded(auction: AuctionDocument) {
    const contract = this.web3Service.getContract(
      AuctionContract.abi,
      auction.contractAddress,
    );
    try {
      await contract.methods.auctionEnd().call();
      return true;
    } catch (error) {
      if (error instanceof ContractExecutionError) {
        if (
          error.innerError.message.includes(Errors.AUCTION_END_ALREADY_CALLED)
        ) {
          return true;
        }
        if (error.innerError.message.includes(Errors.AUCTION_NOT_ENDED)) {
          return false;
        }
      }
      throw error;
    }
  }

  async getStatus(auctionId: string) {
    const auction = await this.findOneSelectAndPopulateOrErrorOut(
      { _id: auctionId },
      '',
      [{ path: 'highestBid', populate: 'user' }],
    );
    const ended = await this.hasEnded(auction);
    if (ended !== auction.ended) {
      auction.ended = ended;
      await auction.save();
    }
    return {
      status: auction.ended ? 'ended' : 'ongoing',
      highestBid: auction.highestBid,
      address: auction.contractAddress,
      beneficiary: auction.beneficiaryAddress,
      endTime: auction.endTime,
    };
  }

  async getBidHistory(auctionId: string) {
    const bids = await this.bidService.find({ auctionId }, [
      { path: 'auction user' },
    ]);

    return bids;
  }

  async getStatistics(auctionId: string) {
    if (!(await this.bidService.findOne({ auctionId }))) {
      return [{ totalETHVolume: 0, numberOfBids: 0 }];
    }
    const pipeline = [
      { $match: { auctionId } },
      {
        $project: {
          _id: 0,
          bidAmount: {
            $convert: {
              input: '$bidAmount',
              to: 'double',
            },
          }, // convert stored string value to float (double) value
        },
      },
      {
        $group: {
          _id: null,
          totalETHVolume: { $sum: '$bidAmount' },
          numberOfBids: { $sum: 1 },
        },
      },
    ];
    return await this.bidService.model.aggregate(pipeline);
  }

  private getTimeString(time: string) {
    return this.epochTimeToUTCDateString(
      parseInt(time) / TimeUnits.MILLISECONDS,
    );
  }
}
