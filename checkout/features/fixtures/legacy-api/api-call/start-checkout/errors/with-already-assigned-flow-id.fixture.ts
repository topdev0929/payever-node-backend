import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../../../../src/business';
import { ApiCallModel } from '../../../../../../src/common/models';
import { ApiCallSchemaName, BusinessSchemaName } from '../../../../../../src/mongoose-schema';
import { ApiCallFactory, BusinessFactory } from '../../../../../fixture-factories';

class TestFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private apiCallModel: Model<ApiCallModel> = this.application.get(getModelToken(ApiCallSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = '012c165f-8b88-405f-99e2-82f74339a757';
    const apiCallId: string = 'b5965f9d-5971-4b02-90eb-537a0a6e07c7';
    const flowId: string = 'e651039c-93b2-405a-b369-cec26d22ffe9';

    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: businessId,
    }) as any);

    await this.apiCallModel.create(ApiCallFactory.create({
      _id: apiCallId,
      businessId: business.id,
      flowId: flowId,
    }) as any);
  }
}

export = TestFixture;
