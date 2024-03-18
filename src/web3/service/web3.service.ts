import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfigEnum } from 'src/config/env.enum';
import { default as Web3 } from 'web3';

@Injectable()
export class Web3Service {
  private logger = new Logger(Web3Service.name);

  web3: Web3;
  constructor(private config: ConfigService) {
    // get provider URL from ENV configuration
    const providerUrl = config.getOrThrow(EnvConfigEnum.WEB3_PROVIDER_URL);
    const provider = new Web3.providers.HttpProvider(providerUrl);
    // initialize and expose web3 object
    this.web3 = new Web3(provider);
  }
}
