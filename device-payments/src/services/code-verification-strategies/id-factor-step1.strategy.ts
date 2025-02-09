import { Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit';

import { CodeVerifyDto, IdFactorResponseDto } from '../../dto';
import { VerificationStep, VerificationType } from '../../enum';
import { PaymentCode } from '../../interfaces';
import { AbstractCodeVerificationStrategy } from './abstract-code-verification.strategy';

@Injectable()
@ServiceTag('verification-strategy')
export class IdFactorStep1Strategy extends AbstractCodeVerificationStrategy {
  public readonly type: VerificationType = VerificationType.verifyById;
  public readonly step: VerificationStep = VerificationStep.initialization;
  public readonly factor: boolean = true;

  public async verify(
    dto: CodeVerifyDto,
    code: PaymentCode,
  ): Promise<IdFactorResponseDto> {
    code.log.verificationStep = VerificationStep.confirmation;

    return {
      address: {
        city: code.flow.billingAddress.city,
        country: code.flow.billingAddress.country,
        post_code: code.flow.billingAddress.zipCode,
        street_number: code.flow.billingAddress.street,
      },
      amount: dto.amount,
      email: code.flow.billingAddress.email,
      firstName: code.flow.billingAddress.firstName,
      lastName: code.flow.billingAddress.lastName,
      payment_id: code.flow.payment.id,
      payment_method: code.flow.payment.paymentType,
      status: code.status,
    };
  }
}
