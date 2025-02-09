import { Injectable, MethodNotAllowedException } from '@nestjs/common';

import { ServiceTag } from '@pe/nest-kit';
import { CodeVerifyDto } from '../../dto';
import { VerificationStep, VerificationType } from '../../enum';
import { PaymentCode } from '../../interfaces';
import { AbstractCodeVerificationStrategy } from './abstract-code-verification.strategy';

@Injectable()
@ServiceTag('verification-strategy')
export class PaymentCommonStep3Strategy extends AbstractCodeVerificationStrategy {
  public readonly type: VerificationType = VerificationType.verifyByPayment;
  public readonly step: VerificationStep = VerificationStep.verified;
  public readonly factor: boolean = false;

  public async verify(dto: CodeVerifyDto, code: PaymentCode): Promise<never> {
    throw new MethodNotAllowedException('This code is already verified');
  }
}
