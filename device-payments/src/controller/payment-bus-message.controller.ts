/* tslint:disable:object-literal-sort-keys */
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';

import { PaymentPayloadDto } from '../dto/payment';
import { RabbitMessagesEnum, MessageBusChannelsEnum } from '../enum';
import { PaymentCode, PaymentCodeModel } from '../interfaces';
import { PaymentCodeSchemaName } from '../schemas';

@Controller()
export class PaymentBusMessageController {
  constructor(
    @InjectModel(PaymentCodeSchemaName) private readonly paymentCodeModel: PaymentCodeModel,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.devicePayments,
    name: RabbitMessagesEnum.CheckoutPaymentCreated,
  })
  public async onPaymentCreated(data: PaymentPayloadDto): Promise<void> {
    await this.onPaymentEvent(data);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.devicePayments,
    name: RabbitMessagesEnum.CheckoutPaymentUpdated,
  })
  public async onPaymentUpdated(data: PaymentPayloadDto): Promise<void> {
    await this.onPaymentEvent(data);
  }

  private async onPaymentEvent(data: PaymentPayloadDto): Promise<void> {
    if (!data?.payment?.payment_flow?.id) {
      return; 
    }

    const code: PaymentCode = await this.paymentCodeModel.findOne({
      'flow.id': data.payment.payment_flow.id,
    }).exec();

    if (!code) {
      return; 
    }

    if (code.flow.billingAddress.phone) {
      data.payment.address.phone = code.flow.billingAddress.phone.replace(
        /[^+\d]/g,
        '',
      );
    }

    const update: any = {
      'flow.amount': data.payment.total,
      'flow.payment.id': data.payment.id,
      'flow.payment.uuid': data.payment.uuid,
      'flow.payment.paymentType': data.payment.payment_type,
      'flow.billingAddress.firstName': data.payment.address.first_name,
      'flow.billingAddress.lastName': data.payment.address.last_name,
      'flow.billingAddress.email': data.payment.address.email,
      'flow.billingAddress.country': data.payment.address.country,
      'flow.billingAddress.city': data.payment.address.city,
      'flow.billingAddress.zipCode': data.payment.address.zip_code,
      'flow.billingAddress.street': data.payment.address.street,
    };

    if (data.payment.address.phone) {
      update['flow.billingAddress.phone'] = data.payment.address.phone.replace(/[^+\d]/g, '');
    }

    await this.paymentCodeModel.findOneAndUpdate(
      { 'flow.id': data.payment.payment_flow.id },
      { $set: update },
      {
        new: true,
        setDefaultsOnInsert: true,
      },
    );
  }
}
