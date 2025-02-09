import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentCodeSchemaName } from '../../mongoose-schema';
import { PaymentCodeModel } from '../models';
import { PaymentCodeStatusEnum } from '../enum';
import { ApiCallModel } from '../../common/models';

@Injectable()
export class PaymentCodeService {
  constructor(
    @InjectModel(PaymentCodeSchemaName) private readonly paymentCodeModel: Model<PaymentCodeModel>,
  ) { }

  public async createPaymentCode(apiCall: ApiCallModel): Promise<PaymentCodeModel> {
    return this.paymentCodeModel.create({
      apiCallId: apiCall.id,
      businessId: apiCall.businessId,
      code: await this.generateCode(apiCall),
    });
  }

  public async getPaymentCodeByApiCall(apiCall: ApiCallModel): Promise<PaymentCodeModel> {
    return this.paymentCodeModel.findOne({
      apiCallId: apiCall.id,
    });
  }

  public async setPaymentCodeAsVerified(apiCall: ApiCallModel): Promise<PaymentCodeModel> {
    return this.paymentCodeModel.findOneAndUpdate(
      {
        apiCallId: apiCall.id,
      },
      {
        $set: { status: PaymentCodeStatusEnum.verified },
      },
      { new: true },
    );
  }

  private async generateCode(apiCall: ApiCallModel): Promise<number> {
    let code: number;
    let existingCode: PaymentCodeModel;

    do {
      code = PaymentCodeService.getRandomInt(100000, 999999);

      existingCode = await this.paymentCodeModel.findOne({
        businessId: apiCall.businessId,
        code,
        status: { $ne: PaymentCodeStatusEnum.verified },
      });
    } while (existingCode);

    return code;
  }

  private static getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
