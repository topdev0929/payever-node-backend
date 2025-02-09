/* eslint-disable object-literal-sort-keys */
/* eslint-disable no-duplicate-string */
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { PaymentCodeModel, PaymentModel } from '../../../../src/legacy-api/models';
import { VerifyTypeEnum } from '../../../../src/legacy-api/enum';
import { ApiCallModel } from '../../../../src/common/models';

const PAYMENT_ID: string = '3dc8e758-87e9-4175-b371-3310c041aa07';
const API_CALL_ID: string = '8e3dae02-6bcb-4e22-aa24-b4e0e1bf144e';
const BUSINESS_ID: string = '2382ffce-5620-4f13-885d-3c069f9dd9b4';

class PaymentsFixture extends BaseFixture {
  private readonly paymentModel: Model<PaymentModel> = this.application.get('PaymentModel');
  private readonly apiCallModel: Model<ApiCallModel> = this.application.get('ApiCallModel');
  private readonly paymentCodeModel: Model<PaymentCodeModel> = this.application.get('PaymentCodeModel');


  public async apply(): Promise<void> {
    await this.paymentModel.create({
      _id: '5cf4e29b0db8d9ff7b82a0c8',
      uuid: PAYMENT_ID,
      amount: 20,
      api_call_id: API_CALL_ID,
      billing_address: {
        _id: '5cf4e29b2d99dc1d46584b32',
        uuid: '6d455425-fa13-46f6-aa3e-cb053e942344',
        salutation: 'SALUTATION_MRS',
        first_name: 'Stub',
        last_name: 'Waiting_bank',
        email: 'm.kunze@wasserbadmail.de',
        country: 'DE',
        country_name: 'Germany',
        city: 'Berlin',
        zip_code: '73888',
        street: 'Sonnentalweg 18',
        phone: '4212345678',
      },
      business_option_id: '28946',
      business_uuid: BUSINESS_ID,
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
      original_id: PAYMENT_ID,
      payment_details: {
        initialize_unique_id: '31HA07BC813F42ECAC68344F93F463E6',
        conditions_accepted: true,
      },
      payment_fee: 0,
      payment_type: 'santander_pos_factoring_de',
      reference: 'order-6eb3399',
      shipping_address: null,
      shipping_category: null,
      shipping_method_name: '',
      shipping_option_name: null,
      specific_status: 'NEW_TRANSACTION',
      status: 'STATUS_IN_PROCESS',
      total: 20,
      updated_at: '2018-10-24T14:37:28.000Z',
    } as any);

    await this.apiCallModel.create({
      _id: API_CALL_ID,
      businessId: BUSINESS_ID,
      verify_type: VerifyTypeEnum.code,
    } as any);

    await this.paymentCodeModel.create({
      apiCallId: API_CALL_ID,
      businessId: BUSINESS_ID,
      code: 123456,
    } as any);
  }
}

export = PaymentsFixture;
