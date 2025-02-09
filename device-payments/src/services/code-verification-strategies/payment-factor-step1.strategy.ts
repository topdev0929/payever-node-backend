import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ServiceTag } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { CodeVerifyDto, CodeVerifyResultDto, PaymentDto } from '../../dto';
import { VerificationStep, VerificationType } from '../../enum';
import { BusinessModel, CheckoutModel, PaymentCode } from '../../interfaces';
import { BusinessSchemaName, CheckoutSchemaName } from '../../schemas';
import { CodeGeneratorService } from '../code-generator.service';
import { CommunicationsService } from '../communications.service';
import { AbstractCodeVerificationStrategy } from './abstract-code-verification.strategy';

@Injectable()
@ServiceTag('verification-strategy')
export class PaymentFactorStep1Strategy extends AbstractCodeVerificationStrategy {
  public readonly type: VerificationType = VerificationType.verifyByPayment;
  public readonly step: VerificationStep = VerificationStep.initialization;
  public readonly factor: boolean = true;

  constructor(
    @InjectModel(BusinessSchemaName)
    private readonly businessModel: Model<BusinessModel>,
    @InjectModel(CheckoutSchemaName)
    private readonly checkoutModel: Model<CheckoutModel>,
    private readonly codeGenerator: CodeGeneratorService,
    private readonly communicationsService: CommunicationsService,
  ) {
    super();
  }

  public async verify(
    dto: CodeVerifyDto,
    code: PaymentCode,
  ): Promise<{ code: number } & CodeVerifyResultDto> {
    const business: BusinessModel = await this.businessModel.findOne({
      businessId: code.flow.businessId,
    }).exec();

    code.log.verificationStep = VerificationStep.confirmation;
    code.code = await this.codeGenerator.generate(business);

    const paymentDto: PaymentDto = new PaymentDto();
    paymentDto.phone_number =
      '+' + String(Number(code.flow.billingAddress.phone));
    paymentDto.amount = dto.amount;
    paymentDto.terminal_id = code.terminalId;
    paymentDto.application_id = code.applicationId;
    paymentDto.application_type = code.type;

    await this.communicationsService.sendCode(
      code.flow.businessId,
      paymentDto,
      code,
    );

    return {
      amount: code.flow.amount,
      code: code.code,
      payment_id: code.flow.payment.id,
      payment_method: code.flow.payment.paymentType,
      status: code.status,
    };
  }
}
