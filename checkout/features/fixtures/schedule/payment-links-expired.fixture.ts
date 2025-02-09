import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { PaymentLinkModel } from '../../../src/payment-links/models';
import { PaymentLinkSchemaName } from '../../../src/mongoose-schema';
import { PaymentLinkFactory } from '../../fixture-factories';

class TestFixture extends BaseFixture {
  private paymentLinkModel: Model<PaymentLinkModel> = this.application.get(getModelToken(PaymentLinkSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = '012c165f-8b88-405f-99e2-82f74339a757';
    const paymentLinkId: string = '71d15d86-7d1d-4178-b0c8-1d4e1230b2c0';
    const clientId: string = 'de9d1a9f-0c4e-4ebc-ae98-bc2bace0605c';

    await this.paymentLinkModel.create(PaymentLinkFactory.create({
      _id: paymentLinkId,
      amount: 1000,
      business_id: businessId,
      client_id: clientId,
      currency: 'EUR',
      fee: 0,
      order_id: 'test_order_id',
      created_at: new Date(2023, 1, 17, 8, 30, 0 ),
      expires_at: new Date(2023, 11, 31, 23, 59, 59 ),
      email: 'test@test.com',
    }) as any);
  }
}

export = TestFixture;
