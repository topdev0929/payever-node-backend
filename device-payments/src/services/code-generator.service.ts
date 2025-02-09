import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CodeStatus, VerificationType } from '../enum';
import { BusinessInterface, BusinessModel, PaymentCode } from '../interfaces';
import { PaymentCodeSchemaName } from '../schemas';
import { RabbitProducer } from './rabbit-producer.service';

@Injectable()
export class CodeGeneratorService {
  constructor(
    private readonly rabbitService: RabbitProducer,
    @InjectModel(PaymentCodeSchemaName) private readonly paymentCodeModel: Model<PaymentCode>,
  ) {
  }

  public async generate(business: BusinessInterface): Promise<number> {
    if (CodeGeneratorService.isPaymentCodeGenerationDisabled(business.settings)) {
      return undefined;
    }

    let code: number;
    let existingCode: PaymentCode;

    do {
      code = CodeGeneratorService.getRandomInt(100000, 999999);

      existingCode = await this.paymentCodeModel.findOne({
        businessId: business._id,
        code: code,
        status: { $ne: CodeStatus.paid },
      }).exec();
    } while (existingCode);

    return code;
  }

  private static getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private static isPaymentCodeGenerationDisabled(settings: BusinessModel['settings']): boolean {
    return settings.verificationType
      && settings.verificationType === VerificationType.verifyById
      && !settings.secondFactor;
  }
}
