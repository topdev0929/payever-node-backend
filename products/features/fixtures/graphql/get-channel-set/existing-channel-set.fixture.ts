import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../../src/business';
import { ChannelSetModel } from '../../../../src/channel-set';
import { BusinessSchemaName } from '../../../../src/business/schemas';
import { ChannelSetSchemaName } from '../../../../src/channel-set/schemas';
import { businessFactory, ChannelSetFactory } from '../../factories';

class ExistingChannelSetManyFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private channelSetModel: Model<ChannelSetModel> = this.application.get(getModelToken(ChannelSetSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = 'a803d4c3-c447-4aab-a8c7-c7f184a8e77f';
    const channelSetIdLink: string = 'a888336c-fe1f-439c-b13c-f351db6bbc2e';
    const channelSetIdShop: string = 'f351db6b-439c-b13c-fe1f-a888336cbc2e';
    const channelSetIdPos: string = '8d49b19f-4aab-a8c7-c447-a803d4c3bc2e';

    await this.businessModel.create(businessFactory({
      _id: businessId,
    }));

    await this.channelSetModel.create(ChannelSetFactory.create({
      _id: channelSetIdLink,
      businessId: businessId,
      customPolicy: false,
      enabledByDefault: false,
      name: 'link name',
      originalId: '9c355907-c644-4737-9dd1-693d717a1c18',
      type: 'link',
    }));

    await this.channelSetModel.create(ChannelSetFactory.create({
      _id: channelSetIdShop,
      businessId: businessId,
      customPolicy: true,
      enabledByDefault: true,
      name: 'shop name',
      type: 'shop',
    }));

    await this.channelSetModel.create(ChannelSetFactory.create({
      _id: channelSetIdPos,
      businessId: businessId,
      customPolicy: false,
      enabledByDefault: true,
      name: 'pos name',
      type: 'pos',
    }));
  }
}

export = ExistingChannelSetManyFixture;
