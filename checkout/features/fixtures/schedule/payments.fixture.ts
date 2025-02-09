/* eslint-disable object-literal-sort-keys */
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { PaymentModel } from '../../../src/legacy-api';

class PaymentsFixture extends BaseFixture {
  private readonly model: Model<PaymentModel> = this.application.get('PaymentModel');

  public async apply(): Promise<void> {
    await this.model.create({
      _id: '5cf4e29b0db8d9ff7b82a0c8',
      uuid: '3dc8e758-87e9-4175-b371-3310c041aa07',
      amount: 20,
      billing_address: {
        _id: '5cf4e29b2d99dc1d46584b32',
        uuid: '6d455425-fa13-46f6-aa3e-cb053e942344',
        salutation: 'SALUTATION_MRS',
        first_name: 'Stub',
        last_name: 'Waiting_bank',
        // tslint:disable-next-line:no-duplicate-string
        email: 'm.kunze@wasserbadmail.de',
        country: 'DE',
        country_name: 'Germany',
        city: 'Berlin',
        zip_code: '73888',
        street: 'Sonnentalweg 18',
        phone: '4212345678',
      },
      business_option_id: '28946',
      business_uuid: '012c165f-8b88-405f-99e2-82f74339a757',
      channel: 'api',
      channel_set_uuid: '82f99cac-83fb-44a9-82aa-c28ced2e44b6',
      color_state: 'yellow',
      created_at: '2018-08-09T06:26:13.000Z',
      currency: 'EUR',
      customer_email: 'm.kunze@wasserbadmail.de',
      customer_name: 'm.kunze@wasserbadmail.de',
      delivery_fee: 0,
      down_payment: 0,
      merchant_name: 'AutomationBusiness',
      original_id: '3dc8e758-87e9-4175-b371-3310c041aa07',
      payment_details: {
        initialize_unique_id: '31HA07BC813F42ECAC68344F93F463E6',
        conditions_accepted: true,
      },
      payment_fee: 0,
      payment_type: 'santander_installment',
      reference: 'order-6eb3399',
      shipping_address: null,
      shipping_category: null,
      shipping_method_name: '',
      shipping_option_name: null,
      specific_status: 'WAITING_BANK',
      status: 'STATUS_IN_PROCESS',
      total: 20,
      updated_at: '2018-10-24T14:37:28.000Z',
      items: [
        {
          description: 'item_description1',
          identifier: 'item1',
          name: 'Langenscheidt Wörterbuch Englisch',
          price: 105,
          quantity: 1,
          thumbnail: 'https://openbank-wc.demo.payever.org/wp-content/uploads/2019/01/album-1.jpg',
          _id: '608fc43b-c7cf-421f-b048-378bdbe46568'
        },
      ],
      shipping_option: {
        name: 'dhl',
        price: 10
      },
    } as any);
  }
}

export = PaymentsFixture;
