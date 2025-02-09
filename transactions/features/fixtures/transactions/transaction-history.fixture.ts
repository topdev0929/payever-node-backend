import { BaseFixture } from '@pe/cucumber-sdk';
import { TransactionModel } from '../../../src/transactions/models';
import { transactionFactory } from '../factories';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { TransactionSchemaName } from '../../../src/transactions/schemas';
import { BUSINESS_1_ID, TRANSACTION_1_ID, TRANSACTION_2_ID, USER_1_ID } from '../const';

const YEAR_2021: string  = '2021-01-01';
const YEAR_2022: string  = '2022-01-01';

const paymentFlowId: string = '2';
class TransactionHistoryFixture extends BaseFixture {
  private readonly transactionModel: Model<TransactionModel> =
    this.application.get(getModelToken(TransactionSchemaName));

  public async apply(): Promise<void> {
    await this.transactionModel.create(transactionFactory.create({
      uuid: TRANSACTION_1_ID,
      business_uuid: BUSINESS_1_ID,
      user_uuid: USER_1_ID,
      business_option_id: 34196,
      payment_flow_id: paymentFlowId,
      channel_set_uuid: '7c2298a7-a172-4048-8977-dbff24dec100',
      channel: 'pos',
      reference: 'f3d44333-21e2-4f0f-952b-72ac2dfb8fc9',
      type: 'payex_creditcard',
      amount: 50,
      total: 50,
      items: undefined,
      customer_name: 'Customer Test',
      customer_email: 'test@test.com',
      merchant_name: `Test Merchant`,
      merchant_email: `testcases@merchant.com`,
      shipping_address: {
        salutation: 'SALUTATION_MR',
        first_name: `First name Shipping`,
        last_name: `Last_name Shipping`,
        email: `test_shipping@test.com`,
        country: 'DE',
        country_name: 'Germany',
        city: 'Hamburg',
        zip_code: '12345',
        street: 'Rödingsmarkt shipping',
      } as any,
      delivery_fee: 2,
      shipping_method_name: 'some shipping name',
      shipping_order_id: '5db105b8-2da6-421e-8e6a-1c67048cda2b',
      status: 'Test status',
      specific_status: 'Test specific status',
      original_id: TRANSACTION_1_ID,
      pos_merchant_mode: true,
      pos_verify_type: 1,
      history: [
        {
          _id: 'history-id-1',
          action: 'statuschanged',
          amount: 1,
          payment_status: 'STATUS_ACCEPTED',
          created_at: `${YEAR_2021}T01:00:01.000+00:00`,
        },
        {
          _id: 'history-id-2',
          action: 'refund',
          amount: 2,
          payment_status: 'STATUS_ACCEPTED',
          created_at: `${YEAR_2021}T01:00:02.000+00:00`,
        },
        {
          _id: 'history-id-3',
          action: 'cancel',
          amount: 3,
          payment_status: 'STATUS_ACCEPTED',
          created_at: `${YEAR_2021}T01:00:03.000+00:00`,
        },
        {
          _id: 'history-id-4',
          action: 'shipping_goods',
          amount: 4,
          payment_status: 'STATUS_ACCEPTED',
          status: 'failed',
          created_at: `${YEAR_2021}T01:00:04.000+00:00`,
        },
        {
          _id: 'history-id-5',
          action: 'shipping_goods',
          amount: 5,
          payment_status: 'STATUS_ACCEPTED',
          status: 'success',
          created_at: `${YEAR_2021}T01:00:05.000+00:00`,
        },
        {
          _id: 'history-id-6',
          action: 'shipping_goods',
          amount: 6,
          payment_status: 'STATUS_ACCEPTED',
          status: 'failed',
          created_at: `${YEAR_2022}T01:00:07.000+00:00`,
        }
      ] as any
    }));

    await this.transactionModel.create(transactionFactory.create({
      uuid: TRANSACTION_2_ID,
      business_uuid: BUSINESS_1_ID,
      user_uuid: USER_1_ID,
      business_option_id: 34196,
      payment_flow_id: paymentFlowId,
      channel_set_uuid: '7c2298a7-a172-4048-8977-dbff24dec100',
      channel: 'pos',
      reference: 'f3d44333-21e2-4f0f-952b-72ac2dfb8fc9',
      type: 'payex_creditcard',
      amount: 50,
      total: 50,
      items: undefined,
      customer_name: 'Customer Test',
      customer_email: 'test@test.com',
      merchant_name: `Test Merchant`,
      merchant_email: `testcases@merchant.com`,
      delivery_fee: 2,
      shipping_method_name: 'some shipping name',
      shipping_order_id: '5db105b8-2da6-421e-8e6a-1c67048cda2b',
      status: 'Test status',
      specific_status: 'Test specific status',
      original_id: TRANSACTION_2_ID,
      pos_merchant_mode: true,
      pos_verify_type: 1,
      history: [
        {
          _id: 't2-history-id-1',
          action: 'statuschanged',
          amount: 210,
          payment_status: 'STATUS_ACCEPTED',
          created_at: `${YEAR_2022}T01:00:01.000+00:00`,
        },
        {
          _id: 't2-history-id-2',
          action: 'refund',
          amount: 220,
          payment_status: 'STATUS_ACCEPTED',
          created_at: `${YEAR_2022}T01:00:02.000+00:00`,
        },
        {
          _id: 't2-history-id-3',
          action: 'cancel',
          amount: 230,
          payment_status: 'STATUS_ACCEPTED',
          created_at: `${YEAR_2022}T01:00:03.000+00:00`,
        },
        {
          _id: 't2-history-id-4',
          action: 'shipping_goods',
          amount: 240,
          payment_status: 'STATUS_ACCEPTED',
          status: 'failed',
          created_at: `${YEAR_2022}T01:00:04.000+00:00`,
        },
        {
          _id: 't2-history-id-5',
          action: 'shipping_goods',
          amount: 250,
          payment_status: 'STATUS_ACCEPTED',
          status: 'failed',
          created_at: `${YEAR_2022}T01:00:05.000+00:00`,
        },
        {
          _id: 't2-history-id-6',
          action: 'shipping_goods',
          amount: 260,
          payment_status: 'STATUS_ACCEPTED',
          status: 'success',
          created_at: `${YEAR_2022}T01:00:06.000+00:00`,
        }
      ] as any
    }));
  }
}

export = TransactionHistoryFixture;
