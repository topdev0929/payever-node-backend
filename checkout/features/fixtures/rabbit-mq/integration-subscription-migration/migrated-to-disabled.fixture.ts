import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessIntegrationSubModel, IntegrationModel } from '../../../../src/integration';
import {
  BusinessIntegrationSubSchemaName,
  BusinessSchemaName,
  IntegrationSchemaName,
} from '../../../../src/mongoose-schema';
// tslint:disable-next-line: no-require-imports
import helper = require('../../fixture-creator-helper');

class TestFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly integrationModel: Model<IntegrationModel> = this.application.get(
    getModelToken(IntegrationSchemaName),
  );
  private readonly subscriptionModel: Model<BusinessIntegrationSubModel> = this.application.get(
    getModelToken(BusinessIntegrationSubSchemaName),
  );

  public async apply(): Promise<void> {
    helper.integrationCreated = 0;

    await helper.createBusiness(
      this.businessModel,
      this.integrationModel,
      this.subscriptionModel,
      'paymentsSubscriptionDisabledBusinessId',
      'payments',
      1,
      false,
    );
  }
}

export = TestFixture;
