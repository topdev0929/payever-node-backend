import { CodeVerifyDto } from '../../dto';
import { VerificationStep, VerificationType } from '../../enum';
import { CodeVerificationResponseInterface, CodeVerificationStrategyInterface, PaymentCode } from '../../interfaces';

export abstract class AbstractCodeVerificationStrategy implements CodeVerificationStrategyInterface {
  public readonly type: VerificationType;
  public readonly step: VerificationStep;
  public readonly factor: boolean;

  public abstract verify(dto: CodeVerifyDto, code: PaymentCode): Promise<CodeVerificationResponseInterface>;
}
