/* tslint:disable:object-literal-sort-keys */
import { BaseFixture } from '@pe/cucumber-sdk';
import { TransactionModel } from '../../../../src/transactions/models';
import { transactionFactory } from '../../factories';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { TransactionSchemaName } from '../../../../src/transactions/schemas';

const transactionId: string = 'ad738281-f9f0-4db7-a4f6-670b0dff5327';
const businessId: string = '36bf8981-8827-4c0c-a645-02d9fc6d72c8';
const userId: string = '08a3fac8-43ef-4998-99aa-cabc97a39261';
const businessOptionId: string = '1';
const paymentFlowId: string = '2';

class ThirdPartyPaymentFixture extends BaseFixture {
  private readonly transactionModel: Model<TransactionModel> =
    this.application.get(getModelToken(TransactionSchemaName));

  public async apply(): Promise<void> {

    await this.transactionModel.create(transactionFactory.create({
      uuid: transactionId,
      billing_address: {
        salutation: 'SALUTATION_MR',
        first_name : `Test First_name`,
        last_name : `Test Last_name`,
        email : `test@test.com`,
        country : 'DE',
        country_name : 'Germany',
        city : 'Hamburg',
        zip_code : '12345',
        street : 'Rödingsmarkt',
      },
      business_uuid : businessId,
      user_uuid: userId,
      business_option_id: businessOptionId,
      payment_flow_id: paymentFlowId,
      channel_set_uuid: '7c2298a7-a172-4048-8977-dbff24dec100',
      channel: 'pos',
      reference: 'f3d44333-21e2-4f0f-952b-72ac2dfb8fc9',
      type: 'stripe',
      amount: 100,
      total: 102,
      items : [
        {
          'uuid' : 'f83c9c9f-77eb-464a-9ef3-95f572301d2c',
          'name' : `test item`,
          'identifier': 'c4bce8c1-6572-43fc-8fc9-0f8f0a5efad1',
          'price' : 50,
          'price_net' : 0,
          'vat_rate' : 0,
          'quantity' : 1,
          'thumbnail' : `https://payeverstaging.blob.core.windows.net/products/image_test`,
        },
        {
          'uuid' : 'c5644efe-583a-44aa-910c-664ee941e1e2',
          'name' : `test item`,
          'identifier': '3a6bd3ae-3b30-41a4-803f-e457d6113279',
          'price' : 25,
          'price_net' : 0,
          'vat_rate' : 0,
          'quantity' : 2,
          'thumbnail' : `https://payeverstaging.blob.core.windows.net/products/image_test`,
        },
      ],
      captured_items: [
        {
          'name' : `test item`,
          'identifier': '3a6bd3ae-3b30-41a4-803f-e457d6113279',
          'price' : 25,
          'quantity' : 1,
        },
      ],
      refunded_items: [
        {
          'name' : `test item`,
          'identifier': '3a6bd3ae-3b30-41a4-803f-e457d6113279',
          'price' : 25,
          'quantity' : 1,
        },
      ],
      history: [
        {
          action: 'test_action',
          created_at: new Date(),
        },
      ],
      customer_name : 'Customer Test',
      customer_email : 'test@test.com',
      merchant_name : `Test Merchant`,
      merchant_email : `testcases@merchant.com`,
      shipping_address : {
        salutation: 'SALUTATION_MR',
        first_name : `First name Shipping`,
        last_name : `Last_name Shipping`,
        email : `test_shipping@test.com`,
        country : 'DE',
        country_name : 'Germany',
        city : 'Hamburg',
        zip_code : '12345',
        street : 'Rödingsmarkt shipping',
      },
      delivery_fee: 2,
      shipping_method_name: 'some shipping name',
      shipping_order_id: '5db105b8-2da6-421e-8e6a-1c67048cda2b',
      status: 'STATUS_ACCEPTED',
      specific_status: 'NONE',
      original_id: '440ec879-7f02-48d4-9ffb-77adfaf79a06',
    }));
  }
}

export = ThirdPartyPaymentFixture;
