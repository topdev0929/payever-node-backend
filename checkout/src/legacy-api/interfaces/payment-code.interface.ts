import { PaymentCodeStatusEnum } from '../enum';

export interface PaymentCodeInterface {
  apiCallId: string;
  businessId: string;
  code: number;
  flowId?: string;
  status: PaymentCodeStatusEnum;
}
