import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaymentMailSchemaName } from '../schemas/payment-mail.schema';
import { Model } from 'mongoose';
import { PaymentMailModel } from '../models';
import { PaymentMailInterface } from '../interfaces';

@Injectable()
export class PaymentMailService {
  constructor(@InjectModel(PaymentMailSchemaName) private readonly sentPaymentMailModel: Model<PaymentMailModel>) { }

  public async getById(paymentMailId: string): Promise<PaymentMailModel> {
    return this.sentPaymentMailModel.findById(paymentMailId);
  }

  public save(paymentMail: PaymentMailInterface): Promise<PaymentMailModel> {
    return this.sentPaymentMailModel.create({
      eventData: paymentMail.eventData,
      templateName: paymentMail.templateName,
      transactionId: paymentMail.transactionId,
    });
  }
}
