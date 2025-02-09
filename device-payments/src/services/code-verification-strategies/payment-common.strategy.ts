import { Injectable } from '@nestjs/common';

import { ServiceTag } from '@pe/nest-kit';
import { CodeVerifyDto, CodeVerifyResultDto } from '../../dto';
import { CodeStatus, VerificationStep, VerificationType } from '../../enum';
import { PaymentCode } from '../../interfaces';
import { AbstractCodeVerificationStrategy } from './abstract-code-verification.strategy';

@Injectable()
@ServiceTag('verification-strategy')
export class PaymentCommonStrategy extends AbstractCodeVerificationStrategy {
  public readonly type: VerificationType = VerificationType.verifyByPayment;
  public readonly step: VerificationStep = VerificationStep.initialization;
  public readonly factor: boolean = false;

  public async verify(
    dto: CodeVerifyDto,
    code: PaymentCode,
  ): Promise<CodeVerifyResultDto> {
    const result: CodeVerifyResultDto = {
      amount: code.flow.amount,
      payment_id: code.flow.payment.id,
      payment_method: code.flow.payment.paymentType,
      status: code.status,
    };

    code.status = CodeStatus.paid;
    code.log.verificationStep = VerificationStep.confirmation;

    return result;
  }
}
