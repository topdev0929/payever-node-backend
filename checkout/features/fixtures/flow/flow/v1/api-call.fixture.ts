import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../../../src/business';
import { ApiCallSchemaName, BusinessSchemaName } from '../../../../../src/mongoose-schema';
import { ApiCallFactory, BusinessFactory } from '../../../../fixture-factories';
import { ApiCallModel } from '../../../../../src/common/models';

class TestFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private apiCallModel: Model<ApiCallModel> = this.application.get(getModelToken(ApiCallSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = '012c165f-8b88-405f-99e2-82f74339a757';
    const apiCallId: string = 'b5965f9d-5971-4b02-90eb-537a0a6e07c7';

    await this.apiCallModel.create(ApiCallFactory.create({
      _id: apiCallId,
      amount: 1000,
      businessId: businessId,
      channel: 'magento',
      currency: 'EUR',
      fee: 0,
      order_id: 'test_order_id',
      success_url: 'https://payever.de/success/api-call-id/--CALL-ID--/payment-id/--PAYMENT-ID--',
      pending_url: 'https://payever.de/pending/api-call-id/--CALL-ID--/payment-id/--PAYMENT-ID--',
      failure_url: 'https://payever.de/failure/api-call-id/--CALL-ID--/payment-id/--PAYMENT-ID--',
      cancel_url: 'https://payever.de/cancel/api-call-id/--CALL-ID--/payment-id/--PAYMENT-ID--',
      notice_url:  'https://payever.de/notice/api-call-id/--CALL-ID--/payment-id/--PAYMENT-ID--',
      customer_redirect_url: 'https://payever.de/customer-redirect/api-call-id/--CALL-ID--/payment-id/--PAYMENT-ID--',
    }) as any);
  }
}

export = TestFixture;
