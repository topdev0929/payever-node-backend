import { BaseFixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessLocalDocument } from '../../src/projections/models';
import { CommonChannelDocument, CommonChannel } from '../../src/message/submodules/messaging/common-channels';

import {
  ID_OF_ANOTHER_EXISTING_BUSINESS,
  ID_OF_BUSINESS_2,
  ID_OF_BUSINESS_3,
  ID_OF_EXISTING_BUSINESS,
  SOME_OWNER_ID,
  OWNERS_BUSINESS_ID,
  ID_OF_CHANNEL,
} from './const';

class BusinessFixture extends BaseFixture {
  protected readonly businessModel: Model<BusinessLocalDocument> = this.application.get(`BusinessModel`);
  
  protected readonly channelChatModel: Model<CommonChannelDocument> =
    this.application.get(getModelToken(CommonChannel.name));
    
  public async apply(): Promise<void> {
   
    await this.businessModel.create({
      _id: ID_OF_EXISTING_BUSINESS,
      name: 'business-number-one',
      logo: 'business-logo.png',
      enabled: true,
      owner: '9d8879ca-6573-41d8-8b2b-de93dd31f5ca',
      hasMessageApp: true,
    });

    await this.businessModel.create({
      _id: ID_OF_ANOTHER_EXISTING_BUSINESS,
      name: 'another business',
      logo: 'another-business-logo.png',
      enabled: true,
      owner: '9d8879ca-6573-41d8-8b2b-de93dd31f5cb',
      hasMessageApp: true,
    });

    await this.businessModel.create({
      _id: ID_OF_BUSINESS_2,
      name: 'business-2',
      logo: 'business-2-logo.png',
      enabled: true,
      owner: '_id-owner-of-business-2',
      hasMessageApp: true,
    });

    await this.businessModel.create({
      _id: ID_OF_BUSINESS_3,
      name: 'business-3',
      logo: 'business-3-logo.png',
      enabled: true,
      owner: '_id-owner-of-business-3',
      hasMessageApp: false,
    });

    await this.businessModel.create({
      _id: OWNERS_BUSINESS_ID,
      name: 'business-number-one',
      logo: 'business-logo.png',
      enabled: true,
      owner: SOME_OWNER_ID,
      hasMessageApp: true,
    });
  }
}

export = BusinessFixture;
