import { getModelToken } from '@nestjs/mongoose';
import { LanguageModel, LanguageSchemaName } from '@pe/common-sdk';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { IntegrationModel } from '../../../../../src/integration/models';
import { IntegrationSchemaName } from '../../../../../src/mongoose-schema';
import { IntegrationFactory, LanguageFactory } from '../../../../fixture-factories';

class TestFixture extends BaseFixture {
  private languageModel: Model<LanguageModel> = this.application.get(getModelToken(LanguageSchemaName));
  private integrationModel: Model<IntegrationModel> = this.application.get(getModelToken(IntegrationSchemaName));

  public async apply(): Promise<void> {
    await this.languageModel.create(LanguageFactory.createDefaultLanguages());
    await this.integrationModel.create(IntegrationFactory.createDefaultIntegrations());
  }
}

export = TestFixture;
