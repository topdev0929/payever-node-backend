import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../../../src/business';
import { ChannelSetModel } from '../../../../../src/channel-set';
import { BusinessSchemaName, ChannelSetSchemaName } from '../../../../../src/mongoose-schema';
import { BusinessFactory } from '../../../../fixture-factories';
import { ChannelSetFactory } from '../../../../fixture-factories/channel-set.factory';

class TestFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private channelSetModel: Model<ChannelSetModel> = this.application.get(getModelToken(ChannelSetSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = 'a803d4c3-c447-4aab-a8c7-c7f184a8e77f';
    const channelSetIdPosOne: string = 'a888336c-fe1f-439c-b13c-f351db6bbc2e';
    const channelSetIdLinkOne: string = 'c42f5758-cd13-4c2f-b1a4-05fc73c5a39a';
    const channelSetIdFinExpOne: string = 'cc1ea7d2-ea03-44f5-b54f-2adedd0879e0';

    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: businessId,
    }) as any);

    const channelSetPosOne: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create({
      _id: channelSetIdPosOne,
      active: false,
      type: 'pos',
    }) as any);
    business.channelSets.push(channelSetPosOne as any);

    const channelSetLinkOne: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create({
      _id: channelSetIdLinkOne,
      active: false,
      type: 'shop',
    }) as any);
    business.channelSets.push(channelSetLinkOne as any);

    const channelSetFinExpOne: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create({
      _id: channelSetIdFinExpOne,
      active: false,
      type: 'shop',
    }) as any);
    business.channelSets.push(channelSetFinExpOne as any);

    await business.save();
  }
}

export = TestFixture;
