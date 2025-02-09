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
    const channelSetIdPosThree: string = 'c7c2af97-8ebd-4593-9c38-35577f5e0a14';

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

    const channelSetPosThree: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create({
      _id: channelSetIdPosThree,
      active: false,
      type: 'pos',
    }) as any);
    business.channelSets.push(channelSetPosThree as any);

    await business.save();
  }
}

export = TestFixture;
