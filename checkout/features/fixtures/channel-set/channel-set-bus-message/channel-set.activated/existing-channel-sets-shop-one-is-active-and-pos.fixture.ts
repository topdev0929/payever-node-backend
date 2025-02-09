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
    const channelSetIdPosTwo: string = 'c42f5758-cd13-4c2f-b1a4-05fc73c5a39a';
    const channelSetIdShopOne: string = 'b185a2c1-4fcc-4c63-aa7b-6b7adb560aa9';
    const channelSetIdShopTwo: string = '73572bad-3a35-4e1d-b1c9-d5a115146443';
    const channelSetIdShopThree: string = '9e2aefb3-e849-4430-a962-79d0f7e00e96';

    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: businessId,
    }) as any);

    const channelSetPosOne: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create({
      _id: channelSetIdPosOne,
      active: true,
      type: 'pos',
    }) as any);
    business.channelSets.push(channelSetPosOne as any);

    const channelSetPosTwo: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create({
      _id: channelSetIdPosTwo,
      active: false,
      type: 'pos',
    }) as any);
    business.channelSets.push(channelSetPosTwo as any);

    const channelSetShopOne: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create({
      _id: channelSetIdShopOne,
      active: false,
      type: 'shop',
    }) as any);
    business.channelSets.push(channelSetShopOne as any);

    const channelSetShopTwo: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create({
      _id: channelSetIdShopTwo,
      active: false,
      type: 'shop',
    }) as any);
    business.channelSets.push(channelSetShopTwo as any);

    const channelSetShopThree: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create({
      _id: channelSetIdShopThree,
      active: true,
      type: 'shop',
    }) as any);
    business.channelSets.push(channelSetShopThree as any);

    await business.save();
  }
}

export = TestFixture;
