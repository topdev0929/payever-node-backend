import { FlowApiCallSplitAmountResponseDto } from './flow-api-call-split-amount-response.dto';
import { PaymentSplitTypeEnum } from '../../../legacy-api/enum';

export class FlowApiCallSplitResponseDto {
  public type: PaymentSplitTypeEnum;
  public identifier?: string;
  public amount?: FlowApiCallSplitAmountResponseDto;
  public reference?: string;
  public description?: string;
}
