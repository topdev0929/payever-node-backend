import { BadRequestException, Injectable } from '@nestjs/common';

import { ServiceTag } from '@pe/nest-kit';
import { CodeVerifyDto, CodeVerifyResultDto } from '../../dto';
import { CodeStatus, VerificationStep, VerificationType } from '../../enum';
import { PaymentCode } from '../../interfaces';
import { AbstractCodeVerificationStrategy } from './abstract-code-verification.strategy';

@Injectable()
@ServiceTag('verification-strategy')
export class PaymentFactorStep2Strategy extends AbstractCodeVerificationStrategy {
  public readonly type: VerificationType = VerificationType.verifyByPayment;
  public readonly step: VerificationStep = VerificationStep.confirmation;
  public readonly factor: boolean = true;

  public async verify(
    dto: CodeVerifyDto,
    code: PaymentCode,
  ): Promise<CodeVerifyResultDto> {
    if (!dto.verification_step) {
      throw new BadRequestException(
        'Wrong step provided in the verification request',
      );
    }

    code.status = CodeStatus.paid;

    return {
      amount: code.flow.amount,
      payment_id: code.flow.payment.id,
      payment_method: code.flow.payment.paymentType,
      status: code.status,
    };
  }
}
