import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { PaymentLinkSchemaName } from '../../../../src/mongoose-schema';
import { PaymentLinkFactory } from '../../../fixture-factories';
import { PaymentLinkModel } from '../../../../src/payment-links/models';
import * as uuid from 'uuid';

class TestFixture extends BaseFixture {
  private paymentLinkModel: Model<PaymentLinkModel> = this.application.get(getModelToken(PaymentLinkSchemaName));
  
  public async apply(): Promise<void> {
    const businessId: string = '2382ffce-5620-4f13-885d-3c069f9dd9b4';
    const paymentLinkId: string = '71d15d86-7d1d-4178-b0c8-1d4e1230b2c0';
    const paymentLinkIdWithPaymentId: string = '81dfgd86-7d1d-4178-b0c8-1d4e1230b2qw';
    const paymentLinkIdCallbacks: string = 'ed9312fa-3914-4f8e-a207-c78b83b83054';
    const clientId: string = 'de9d1a9f-0c4e-4ebc-ae98-bc2bace0605c';
    
    await this.paymentLinkModel.create(PaymentLinkFactory.create({
      _id: paymentLinkId,
      amount: 1000,
      business_id: businessId,
      client_id: clientId,
      currency: 'EUR',
      fee: 0,
      order_id: 'test_order_id',
      is_active: true,
      transactions_count: 3,
      views_count: 4,
      created_at: new Date(2023, 1, 17, 8, 30, 0 ),
      expires_at: new Date(2025, 11, 31, 23, 59, 59 ),
      shipping_address: {
        first_name: 'first_name',
        last_name: 'last_name',
        street: 'street',
      },
    }) as any);
  
    await this.paymentLinkModel.create(PaymentLinkFactory.create({
      _id: paymentLinkIdCallbacks,
      amount: 500,
      business_id: businessId,
      client_id: clientId,
      currency: 'EUR',
      fee: 0,
      is_active: true,
      transactions_count: 0,
      views_count: 0,
      order_id: 'test_order_id_2',
      created_at: new Date(2023, 1, 16, 8, 30, 0 ),
      success_url: 'http://payment.link/success_url',
      pending_url: 'http://payment.link/pending_url',
      failure_url: 'http://payment.link/failure_url',
      cancel_url: 'http://payment.link/cancel_url',
      notice_url: 'http://payment.link/notice_url',
      customer_redirect_url: 'http://payment.link/customer_redirect_url',
    }) as any);
  
    await this.paymentLinkModel.create(PaymentLinkFactory.create({
      _id: uuid.v4(),
      amount: 350,
      business_id: businessId,
      client_id: clientId,
      currency: 'EUR',
      is_active: true,
      transactions_count: 0,
      views_count: 0,
      order_id: 'test_order_id_3',
      created_at: new Date(2023, 1, 15, 8, 30, 0 )
    }) as any);
  
    await this.paymentLinkModel.create(PaymentLinkFactory.create({
      _id: uuid.v4(),
      amount: 370,
      business_id: businessId,
      client_id: clientId,
      currency: 'EUR',
      is_active: true,
      transactions_count: 0,
      views_count: 0,
      order_id: 'test_order_id_4',
      created_at: new Date(2023, 1, 14, 8, 30, 0 )
    }) as any);
  
    await this.paymentLinkModel.create(PaymentLinkFactory.create({
      _id: paymentLinkIdWithPaymentId,
      amount: 370,
      business_id: businessId,
      client_id: clientId,
      currency: 'EUR',
      is_active: false,
      reusable: false,
      transactions_count: 0,
      views_count: 0,
      payment_id: 'test_payment_id_1',
      order_id: 'test_order_id_5',
      created_at: new Date(2023, 1, 13, 8, 30, 0 )
    }) as any);
  }
}

export = TestFixture;
