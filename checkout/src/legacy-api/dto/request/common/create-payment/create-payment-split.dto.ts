import { PaymentSplitTypeEnum } from '../../../../enum';
import { CreatePaymentSplitAmountDto } from './create-payment-split-amount.dto';

export class CreatePaymentSplitDto {
  public type: PaymentSplitTypeEnum;
  public identifier?: string;
  public amount?: CreatePaymentSplitAmountDto;
  public reference?: string;
  public description?: string;
}
