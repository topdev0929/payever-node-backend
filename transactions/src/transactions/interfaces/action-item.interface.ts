import { RefundCaptureTypeEnum } from '../enum';

export interface ActionItemInterface {
  action: string;
  description?: string;
  enabled: boolean;
  isOptional: boolean;
  partialAllowed: boolean;
  refundCaptureType?: RefundCaptureTypeEnum;
}
