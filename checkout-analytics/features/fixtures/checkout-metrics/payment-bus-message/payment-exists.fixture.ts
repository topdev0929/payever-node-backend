import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { PaymentModel } from '../../../../src/checkout-analytics/models';
import { PaymentSchemaName } from '../../../../src/checkout-analytics/schemas';
import { PaymentFactory } from '../../../fixture-factories/payment.factory';

class TestFixture extends BaseFixture {
  private paymentModel: Model<PaymentModel> =
    this.application.get(getModelToken(PaymentSchemaName));

  public async apply(): Promise<void> {
    const paymentId: string = '65ceae0a-b810-41b9-907f-923b6f7892a1';
    const paymentUuid: string = '815e412c-6881-11e7-9835-52540073a0b6';

    const payment: PaymentModel =
      await this.paymentModel.create(PaymentFactory.create({
        _id: paymentUuid,
        amount: 1000,
        billingAddress: {
          city: 'Berlin',
          country: 'DE',
          countryName: 'Germany',
          street: 'street 1',
          zipCode: '1234',
        },
        businessId: 'business-uuid',
        businessName: 'Business name',
        channel: 'pos',
        channelSetId: 'channel-set-uuid',
        createdAt: '2019-12-14T12:16:09.000Z',
        currency: 'EUR',
        deliveryFee: 0,
        downPayment: 0,
        originalId: paymentId,
        paymentMethod: 'santander_installment',
        reference: '1234567890',
        status: 'STATUS_NEW',
        total: 1000,
        updatedAt: '2019-12-14T12:16:09.000Z',
      }));

    await payment.save();
  }
}

export = TestFixture;
