import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { AUCTION_CONTRACT_GAS } from 'src/auction/enum/auction.enum';
// import HDWalletProvider from '@truffle/hdwallet-provider';
import { EnvConfigEnum } from 'src/config/env.enum';
import { ContractAbi, default as Web3 } from 'web3';
import { Web3Account, SignTransactionResult } from 'web3-eth-accounts';
import { estimateGas } from 'web3/lib/commonjs/eth.exports';

@Injectable()
export class Web3Service {
  private logger = new Logger(Web3Service.name);

  web3: Web3;
  signer: Web3Account;
  private privateKey: string;
  address: string;
  // address = '0x21Af15F32D0FCbEC91edDAC16dc9c96f332a57e3';
  constructor(private config: ConfigService) {
    // get provider URL from ENV configuration
    const providerUrl = config.getOrThrow(EnvConfigEnum.WEB3_PROVIDER_URL);
    // const provider = new HDWalletProvider(address.privateKey, providerUrl);
    const provider = new Web3.providers.HttpProvider(providerUrl);
    // initialize and expose web3 object
    this.web3 = new Web3(provider as any);
    this.privateKey = config.getOrThrow(EnvConfigEnum.WEB3_PRIVATE_KEY);
    this.address = config.getOrThrow(EnvConfigEnum.WEB3_DEFAULT_ADDRESS);
    // this.signer = this.web3.eth.accounts.privateKeyToAccount(this.privateKey);
    // this.web3.eth.accounts.wallet.add(this.signer);
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

  async requestUnsignedTransaction(Tx: {
    encodeABI: () => string;
    estimateGas: () => Promise<string | bigint>;
  }) {
    return {
      unsignedTx: Tx.encodeABI(),
      estimatedGas: await Tx.estimateGas(),
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

  async signTransaction(
    unsignedTx: string,
    from: string,
    gasLimit: string,
    gasPrice: string,
    gas: string,
  ) {
    // Signing will be done away from the server (on the frontend with a metamask wallet perhaps) for better security
    // On server transaction signing will require the server to manage privete keys (wallets) for users.
    const signedTx = await this.web3.eth.accounts.signTransaction(
      // {
      //     from: deployerAddress,
      //     gasLimit: gas,
      //     gasPrice: AUCTION_CONTRACT_GAS.GAS_PRICE,
      //     gas,
      //     data: unsignedTx,
      //   },
      {
        from,
        gasLimit,
        gasPrice,
        gas,
        data: unsignedTx,
      },
      this.privateKey,
    );
    return signedTx;
  }
}
