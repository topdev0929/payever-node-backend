import { PaymentStatusesEnum } from '../enums';

export interface StatusConditionInterface {
  status: PaymentStatusesEnum;
  percent: number;
  value: number;
}
