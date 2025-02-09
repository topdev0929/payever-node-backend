import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { PaymentModel } from '../../../../src/checkout-analytics/models';
import { PaymentSchemaName } from '../../../../src/checkout-analytics/schemas';

class TestFixture extends BaseFixture {
  private paymentModel: Model<PaymentModel> =
    this.application.get(getModelToken(PaymentSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = 'd916ec94-3b2e-4728-bce2-3e9b4f9d353d';

    const payments: any[] = [
      {
        _id: '65ceae0a-b810-41b9-907f-923b6f7892a1',
        amount: 1000,
        businessId: businessId,
        businessName: 'Business name',
        channel: 'pos',
        channelSetId: 'channel-set-uuid',
        createdAt: '2021-02-09T09:22:00.000Z',
        currency: 'EUR',
        originalId: '65ceae0a-b810-41b9-907f-923b6f7892a1',
        paymentMethod: 'santander_installment',
        reference: '1234567890',
        status: 'STATUS_NEW',
        total: 1000,
        updatedAt: '2021-02-09T09:22:00.000Z',
      },
      {
        _id: 'c6ff7b00-6aac-11eb-9439-0242ac130002',
        amount: 1000,
        businessId: businessId,
        businessName: 'Business name',
        channel: 'pos',
        channelSetId: 'channel-set-uuid',
        createdAt: '2021-02-09T09:22:00.000Z',
        currency: 'EUR',
        originalId: 'c6ff7b00-6aac-11eb-9439-0242ac130002',
        paymentMethod: 'santander_installment',
        reference: '1234567890',
        status: 'STATUS_NEW',
        total: 1000,
        updatedAt: '2021-01-09T09:22:00.000Z',
      },
      {
        _id: '29facc0a-6aad-11eb-9439-0242ac130002',
        amount: 1000,
        businessId: businessId,
        businessName: 'Business name',
        channel: 'pos',
        channelSetId: 'channel-set-uuid',
        createdAt: '2021-01-09T09:22:00.000Z',
        currency: 'EUR',
        originalId: '29facc0a-6aad-11eb-9439-0242ac130002',
        paymentMethod: 'stripe',
        reference: '1234567890',
        status: 'STATUS_NEW',
        total: 1000,
        updatedAt: '2021-01-09T09:22:00.000Z',
      },
      {
        _id: 'd222eb44-6ab0-11eb-9439-0242ac130002',
        amount: 1000,
        businessId: businessId,
        businessName: 'Business name',
        channel: 'pos',
        channelSetId: 'channel-set-uuid',
        createdAt: '2020-01-09T09:22:00.000Z',
        currency: 'EUR',
        originalId: 'd222eb44-6ab0-11eb-9439-0242ac130002',
        paymentMethod: 'paypal',
        reference: '1234567890',
        status: 'STATUS_NEW',
        total: 1000,
        updatedAt: '2020-01-09T09:22:00.000Z',
      },
    ];

    await this.paymentModel.create(payments);
  }
}

export = TestFixture;
