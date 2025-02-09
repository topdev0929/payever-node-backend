import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../../../src/business/models';
import { IntegrationModel } from '../../../../../src/integration';
import { BusinessSchemaName, IntegrationSchemaName } from '../../../../../src/mongoose-schema';
import { BusinessFactory, IntegrationFactory } from '../../../../fixture-factories';

class TestFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private integrationModel: Model<IntegrationModel> = this.application.get(getModelToken(IntegrationSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = 'a803d4c3-c447-4aab-a8c7-c7f184a8e77f';

    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: businessId,
    }) as any);

    await this.integrationModel.create(
      IntegrationFactory.createPaymentsIntegrations(),
    );

    await business.save();
  }
}

export = TestFixture;
