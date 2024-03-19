import { Test, TestingModule } from '@nestjs/testing';
import { AuctionController } from './auction.controller';
import { UserService } from 'src/user/service/user.service';
import { getModelToken } from '@nestjs/mongoose';
import { User } from 'src/user/schema/user.schema';
import { Model } from 'mongoose';
import { AuctionService } from '../service/auction.service';
import { BidService } from '../service/bid.service';
import { Web3Service } from 'src/web3/service/web3.service';
import { Auction } from '../schema/auction.schema';
import { Bid } from '../schema/bid.schema';
import { ConfigModule } from '@nestjs/config';
import { envValidator } from 'src/env/validator/env.validator';

describe('AuctionController', () => {
  let controller: AuctionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuctionController],
      providers: [
        UserService,
        AuctionService,
        BidService,
        Web3Service,
        {
          provide: getModelToken(Auction.name),
          useValue: Model<Auction>,
        },
        {
          provide: getModelToken(User.name),
          useValue: Model<User>,
        },
        {
          provide: getModelToken(Bid.name),
          useValue: Model<Bid>,
        },
      ],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.test'],
          validationSchema: envValidator,
        }),
      ],
    }).compile();

    controller = module.get<AuctionController>(AuctionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
