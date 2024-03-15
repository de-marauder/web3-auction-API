import { ResponseStatusEnum } from '../enums/utils.enums';

export type ResponseType = {
  status: ResponseStatusEnum;
  data: Record<string, unknown>;
};
