import { PaymentOptionsEnum } from '../enums';
import { AmountInterface } from './amount.interface';

export interface PaymentOptionInterface {
  paymentMethod?: PaymentOptionsEnum;
  connectionId?: string;
  amountLimits?: AmountInterface;
  enabled?: boolean;
  isBNPL?: boolean;
  productId?: string;
}
