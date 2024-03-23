import { Test, TestingModule } from '@nestjs/testing';
import { AuctionService } from './auction.service';
import { getModelToken } from '@nestjs/mongoose';
import { Auction } from '../schema/auction.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/service/user.service';
import { BidService } from './bid.service';
import { Web3Service } from 'src/web3/service/web3.service';
import { User } from 'src/user/schema/user.schema';
import { Bid } from '../schema/bid.schema';
import { ConfigModule } from '@nestjs/config';
import { envValidator } from 'src/env/validator/env.validator';

describe('AuctionService', () => {
  let service: AuctionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuctionService,
        UserService,
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

    service = module.get<AuctionService>(AuctionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
