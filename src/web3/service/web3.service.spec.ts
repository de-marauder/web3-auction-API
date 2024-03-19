import { Test, TestingModule } from '@nestjs/testing';
import { Web3Service } from './web3.service';
import { ConfigModule } from '@nestjs/config';
import { envValidator } from 'src/env/validator/env.validator';

describe('Web3Service', () => {
  let service: Web3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Web3Service],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.test'],
          validationSchema: envValidator,
        }),
      ],
    }).compile();

    service = module.get<Web3Service>(Web3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('web3 object should be defined', () => {
    expect(service.web3).toBeDefined();
  });
});
