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
