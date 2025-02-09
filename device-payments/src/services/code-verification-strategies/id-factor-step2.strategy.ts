import { BadRequestException, Injectable } from '@nestjs/common';

import { ServiceTag } from '@pe/nest-kit';
import { CodeVerifyDto, IdFactorResponseDto } from '../../dto';
import { CodeStatus, VerificationStep, VerificationType } from '../../enum';
import { PaymentCode } from '../../interfaces';
import { AbstractCodeVerificationStrategy } from './abstract-code-verification.strategy';

@Injectable()
@ServiceTag('verification-strategy')
export class IdFactorStep2Strategy extends AbstractCodeVerificationStrategy {
  public readonly type: VerificationType = VerificationType.verifyById;
  public readonly step: VerificationStep = VerificationStep.confirmation;
  public readonly factor: boolean = true;

  public async verify(
    dto: CodeVerifyDto,
    code: PaymentCode,
  ): Promise<IdFactorResponseDto> {
    if (!dto.verification_step) {
      throw new BadRequestException(
        'Wrong step provided in the verification request',
      );
    }

    code.status = CodeStatus.paid;

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
