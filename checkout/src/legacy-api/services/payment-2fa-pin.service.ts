import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment2faPinSchemaName } from '../../mongoose-schema';
import { Payment2faPinModel, PaymentModel } from '../models';
import { TwoFactorTypeEnum } from '../enum';
import { SendEmailService } from './send-email.service';
import { SendSmsService } from './send-sms.service';
import { ApiCallService } from '../../common/services';
import { ApiCallModel } from '../../common/models';

@Injectable()
export class Payment2faPinService {
  constructor(
    @InjectModel(Payment2faPinSchemaName) private readonly payment2faPinModel: Model<Payment2faPinModel>,
    private readonly apiCallService: ApiCallService,
    private readonly sendEmailService: SendEmailService,
    private readonly sendSmsService: SendSmsService,
  ) { }

  public async send2faPinForPayment(payment: PaymentModel): Promise<void> {
    const apiCall: ApiCallModel = await this.apiCallService.findApiCallById(payment.api_call_id);
    if (!apiCall || !apiCall.verify_two_factor || apiCall.verify_two_factor === TwoFactorTypeEnum.none) {
      return;
    }

    const pinModel: Payment2faPinModel = await this.getOrCreatePayment2faPin(payment);

    switch (apiCall?.verify_two_factor) {
      case TwoFactorTypeEnum.email:
        await this.sendEmailService.sendPayment2faPinEmail(payment.customer_email, pinModel.pin);
        break;
      case TwoFactorTypeEnum.sms:
        await this.sendSmsService.sendPayment2faPinSms(
          apiCall.businessId,
          apiCall.phone,
          pinModel.pin,
          payment.channel_set_id,
        );
        break;
    }

    await this.apiCallService.markTwoFactorTriggered(apiCall);
  }

  public async getUnverifiedPayment2faPin(payment: PaymentModel): Promise<Payment2faPinModel> {
    return this.payment2faPinModel.findOne({
      paymentId: payment.original_id,
      verified: false,
    });
  }

  public async setPaymentPinAsVerified(payment: PaymentModel): Promise<Payment2faPinModel> {
    return this.payment2faPinModel.findOneAndUpdate(
      {
        paymentId: payment.original_id,
        verified: false,
      },
      {
        $set: { verified: true },
      },
      {
        new: true,
      },
    );
  }

  private async getOrCreatePayment2faPin(payment: PaymentModel): Promise<Payment2faPinModel> {
    let pinModel: Payment2faPinModel = await this.getUnverifiedPayment2faPin(payment);

    if (!pinModel) {
      pinModel = await this.createPayment2faPin(payment);
    }

    return pinModel;
  }

  private async createPayment2faPin(payment: PaymentModel): Promise<Payment2faPinModel> {
    return this.payment2faPinModel.create({
      paymentId: payment.original_id,
      pin: await this.generatePin(payment),
      verified: false,
    });
  }

  private async generatePin(payment: PaymentModel): Promise<number> {
    let pin: number;
    let existingPin: Payment2faPinModel;

    do {
      pin = Payment2faPinService.getRandomInt(100000, 999999);

      existingPin = await this.payment2faPinModel.findOne({
        paymentId: payment.original_id,
        pin,
        verified: false,
      });
    } while (existingPin);

    return pin;
  }

  private static getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
