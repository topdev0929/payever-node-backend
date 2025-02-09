import { Injectable } from '@nestjs/common';

import { ServiceTag } from '@pe/nest-kit';
import { CodeVerifyDto, CodeVerifyResultDto } from '../../dto';
import { VerificationStep, VerificationType } from '../../enum';
import { PaymentCode } from '../../interfaces';
import { AbstractCodeVerificationStrategy } from './abstract-code-verification.strategy';

@Injectable()
@ServiceTag('verification-strategy')
export class PaymentCommonStep2Strategy extends AbstractCodeVerificationStrategy {
  public readonly type: VerificationType = VerificationType.verifyByPayment;
  public readonly step: VerificationStep = VerificationStep.confirmation;
  public readonly factor: boolean = false;

  public async verify(
    dto: CodeVerifyDto,
    code: PaymentCode,
  ): Promise<CodeVerifyResultDto> {
    code.log.verificationStep = VerificationStep.verified;

    return {
      amount: code.flow.amount,
      payment_id: code.flow.payment.id,
      payment_method: code.flow.payment.paymentType,
      status: code.status,
    };
  }
}
