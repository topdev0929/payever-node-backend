import { PaymentSplitTypeEnum } from '../../../legacy-api/enum';
import { ApiCallSplitAmountInterface } from './api-call-split-amount.interface';

export interface ApiCallSplitInterface {
  type: PaymentSplitTypeEnum;
  identifier?: string;
  amount?: ApiCallSplitAmountInterface;
  reference?: string;
  description?: string;
}
