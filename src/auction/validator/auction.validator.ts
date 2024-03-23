import * as Joi from 'joi';
import {
  SaveSignedBidDto,
  SubmitBidDto,
  TxParams,
  deployAuctionDto,
  signedTxHashDto,
} from '../dto/auction.dto';
import {
  hexStringValidator,
  stringValidator,
} from 'src/utils/validator/custom.validator';

export const DeployAuctionDtoValidator = Joi.object<deployAuctionDto>({
  beneficiaryAddress: hexStringValidator.required(),
  biddingDuration: stringValidator.required(),
});
export const SignedTransactionValidator = Joi.object<signedTxHashDto>({
  signedTxHash: hexStringValidator.required(),
});

export const SubmitBidDtoValidator = Joi.object<SubmitBidDto>({
  from: hexStringValidator.required(),
  value: stringValidator
    .required()
    .custom((value: string, helpers: Joi.CustomHelpers) => {
      console.log('Validating value: ', value);
      if (isNaN(+value)) {
        const error = helpers.error('InvalidBidValue');
        error.message = `${error.code}: Pass a number as a string`;
        return error;
      }
      return value;
    }),
});

export const SaveSignedBidDtoValidator = Joi.object<SaveSignedBidDto>({
  signedTx: hexStringValidator.required(),
  value: stringValidator
    .required()
    .custom((value: string, helpers: Joi.CustomHelpers) => {
      console.log('Validating value: ', value);
      if (isNaN(+value)) {
        const error = helpers.error('InvalidBidValue');
        error.message = `${error.code}: Pass a number as a string`;
        return error;
      }
      return value;
    }),
});

export const PayableCallOptionsValidator = Joi.object<TxParams>({
  from: hexStringValidator.required(),
  gas: stringValidator,
  gasPrice: stringValidator,
  value: stringValidator.required(),
  to: hexStringValidator,
});
