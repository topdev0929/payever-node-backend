import { CodeVerifyDto } from '../../dto';
import { VerificationStep, VerificationType } from '../../enum';
import { CodeVerificationResponseInterface, PaymentCode } from '../index';

export interface CodeVerificationStrategyInterface {
  readonly step: VerificationStep;
  readonly type: VerificationType;
  readonly factor: boolean;

  verify: (dto: CodeVerifyDto, code: PaymentCode) => Promise<CodeVerificationResponseInterface>;
}
