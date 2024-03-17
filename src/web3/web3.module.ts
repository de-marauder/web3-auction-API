import { Module } from '@nestjs/common';
import { Web3Service } from './service/web3.service';

@Module({
  providers: [Web3Service],
})
export class Web3Module {}
