import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { IntegrationModel } from '../../../../../src/integration/models';
import { IntegrationSchemaName } from '../../../../../src/mongoose-schema';
import { IntegrationFactory } from '../../../../fixture-factories';

class TestFixture extends BaseFixture {
  private integrationModel: Model<IntegrationModel> = this.application.get(getModelToken(IntegrationSchemaName));

  public async apply(): Promise<void> {
    await this.integrationModel.create(IntegrationFactory.createDefaultIntegrations());
  }
}

export = TestFixture;
