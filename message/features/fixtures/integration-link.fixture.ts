import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { IntegrationLinkDocument } from '../../src/message/submodules/integration-link';

import {
  ID_OF_BUSINESS_2,
  ID_OF_BUSINESS_3,
  ID_OF_CHANNEL,
  ID_OF_IntegrationLink_1,
  ID_OF_IntegrationLink_2,
  ID_OF_CHANNEL_2,
} from './const';

class IntegrationLinkFixture extends BaseFixture {
  protected readonly integrationLinkModel: Model<IntegrationLinkDocument> = this.application.get(`IntegrationLinkModel`);


  public async apply(): Promise<void> {

    await this.integrationLinkModel.create({
      _id: ID_OF_IntegrationLink_1,
      business: ID_OF_BUSINESS_2,
      chat: ID_OF_CHANNEL,
      creator: 'any merchant',
      deleted: false,
    });

    await this.integrationLinkModel.create({
      _id: ID_OF_IntegrationLink_2,
      business: ID_OF_BUSINESS_3,
      chat: ID_OF_CHANNEL_2,
      creator: 'any merchant',
      deleted: false,
    });
  }
}

export default IntegrationLinkFixture;
