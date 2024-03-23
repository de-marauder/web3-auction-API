import { PayableCallOptions } from 'web3';

export type deployAuctionDto = {
  deployerAddress: string;
  beneficiaryAddress: string;
  biddingDuration: string;
};

export type signedTxHashDto = { signedTxHash: string };

export type SubmitBidDto = {
  value: string;
  from: string;
};

export type SaveSignedBidDto = {
  value: string;
  signedTx: string;
};

export type TxParams = PayableCallOptions & { to: string };
