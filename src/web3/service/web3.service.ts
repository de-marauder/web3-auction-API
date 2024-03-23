import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TxParams } from 'src/auction/dto/auction.dto';
import { EnvConfigEnum } from 'src/config/env.enum';
import { ContractAbi, default as Web3 } from 'web3';
import { SignTransactionResult } from 'web3-eth-accounts';

@Injectable()
export class Web3Service {
  private logger = new Logger(Web3Service.name);

  web3: Web3;

  constructor(private config: ConfigService) {
    // get provider URL from ENV configuration
    const providerUrl = config.getOrThrow(EnvConfigEnum.WEB3_PROVIDER_URL);
    const provider = new Web3.providers.HttpProvider(providerUrl);
    // initialize and expose web3 object
    this.web3 = new Web3(provider as any);
  }

  async requestUnsignedDeployContractTransaction(
    bytecode: string,
    abi: ContractAbi,
    contractArguments: any[],
  ) {
    const contract = this.getContract(abi);
    const unsignedDeployedTx = contract.deploy({
      data: bytecode,
      arguments: contractArguments,
    });
    const estimatedGas = (await unsignedDeployedTx.estimateGas()).toString();
    const unsignedTxString = unsignedDeployedTx.encodeABI();
    return { estimatedGas, unsignedTxString };
  }

  async requestUnsignedTransaction(
    Tx: {
      encodeABI: () => string;
      estimateGas: (txParams: TxParams) => Promise<string | bigint>;
    },
    txParams: TxParams,
  ) {
    txParams.value = this.web3.utils.toWei(txParams.value, 'ether');
    return {
      unsignedTx: Tx.encodeABI(),
      estimatedGas: (await Tx.estimateGas(txParams)) as string,
    };
  }

  async sendSignedTransaction(signedTransaction: SignTransactionResult) {
    const txHash = await this.web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction,
    );
    return txHash;
  }

  async getReceiptWithSignedTransaction(txHash: string) {
    return this.web3.eth.getTransactionReceipt(txHash);
  }

  getContract(abi: ContractAbi, address?: string) {
    return new this.web3.eth.Contract(abi, address);
  }

  // async signTransaction(
  //   unsignedTx: string,
  //   from: string,
  //   gasLimit: string,
  //   gasPrice: string,
  //   gas: string,
  // ) {
  //   // Signing will be done away from the server (on the frontend with a metamask wallet perhaps) for better security
  //   // On server transaction signing will require the server to manage privete keys (wallets) for users.
  //   const signedTx = await this.web3.eth.accounts.signTransaction(
  //     // {
  //     //     from: deployerAddress,
  //     //     gasLimit: gas,
  //     //     gasPrice: AUCTION_CONTRACT_GAS.GAS_PRICE,
  //     //     gas,
  //     //     data: unsignedTx,
  //     //   },
  //     {
  //       from,
  //       gasLimit,
  //       gasPrice,
  //       gas,
  //       data: unsignedTx,
  //     },
  //     this.privateKey,
  //   );
  //   return signedTx;
  // }
}
