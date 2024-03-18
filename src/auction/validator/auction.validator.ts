import * as Joi from 'joi';
import { SubmitBidDto, deployAuctionDto } from '../dto/auction.dto';
import { stringValidator } from 'src/utils/validator/custom.validator';

export const DeployAuctionDtoValidator = Joi.object<deployAuctionDto>({
  deployerAddress: stringValidator.required(),
  beneficiaryAddress: stringValidator.required(),
  biddingDuration: stringValidator.required(),
});

export const SubmitBidDtoValidator = Joi.object<SubmitBidDto>({
  from: stringValidator.required(),
  value: stringValidator.required(),
});
