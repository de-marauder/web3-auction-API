import * as Joi from 'joi';
import {
  SubmitBidDto,
  deployAuctionDto,
  signedTxHashDto,
} from '../dto/auction.dto';
import { stringValidator } from 'src/utils/validator/custom.validator';

export const DeployAuctionDtoValidator = Joi.object<deployAuctionDto>({
  beneficiaryAddress: stringValidator.required(),
  biddingDuration: stringValidator.required(),
});
export const SignedTransactionValidator = Joi.object<signedTxHashDto>({
  signedTxHash: stringValidator.required(),
});

export const SubmitBidDtoValidator = Joi.object<SubmitBidDto>({
  from: stringValidator.required(),
  value: stringValidator
    .required()
    .custom((value: string, helpers: Joi.CustomHelpers) => {
      console.log('Validating value: ', value);
      if (isNaN(+value)) {
      }
      const error = helpers.error('InvalidBidValue');
      error.message = `${error.code}: Pass a number as a string`;
      return error;
    }),
});
