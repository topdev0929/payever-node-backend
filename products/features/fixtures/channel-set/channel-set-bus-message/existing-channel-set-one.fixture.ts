import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../../src/business';
import { ChannelSetModel } from '../../../../src/channel-set';
import { BusinessSchemaName } from '../../../../src/business/schemas';
import { ChannelSetSchemaName } from '../../../../src/channel-set/schemas';
import { businessFactory, ChannelSetFactory } from '../../factories';

class ExistingChannelSetOneFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private channelSetModel: Model<ChannelSetModel> = this.application.get(getModelToken(ChannelSetSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = 'a803d4c3-c447-4aab-a8c7-c7f184a8e77f';
    const channelSetId: string = 'a888336c-fe1f-439c-b13c-f351db6bbc2e';

    await this.businessModel.create(businessFactory({
      _id: businessId,
    }));

    await this.channelSetModel.create(ChannelSetFactory.create({
      _id: channelSetId,
      businessId: businessId,
      type: 'link',
    }));

  }
}

export = ExistingChannelSetOneFixture;
