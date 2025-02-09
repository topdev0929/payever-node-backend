import { RefundCaptureTypeEnum } from '../enum';

export interface ActionOptionItemInterface {
  action: string;
  allowed: boolean;
  description?: string;
  isOptional: boolean;
  partialAllowed: boolean;
  refundCaptureType?: RefundCaptureTypeEnum;
}
