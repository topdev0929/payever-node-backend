import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../../src/business/models';
import { ChannelSetModel } from '../../../../src/channel-set/models';
import { CheckoutModel } from '../../../../src/checkout/models';
import { BusinessSchemaName, ChannelSetSchemaName, CheckoutSchemaName } from '../../../../src/mongoose-schema';
import { BusinessFactory } from '../../../fixture-factories';

class TestFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private checkoutModel: Model<CheckoutModel> = this.application.get(getModelToken(CheckoutSchemaName));
  private channelSetModel: Model<ChannelSetModel> = this.application.get(getModelToken(ChannelSetSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = '2382ffce-5620-4f13-885d-3c069f9dd9b4';
    const businessId2: string = 'c58d4df4-c5eb-4aab-b106-77caadb60f86';
    const checkoutId: string = '04206b2a-a318-40e7-b031-32bbbd879c74';
    const checkoutId2: string = '2a401671-535f-4c56-8951-b277a660f0e0';
    const channelSetId: string = '006388b0-e536-4d71-b1f1-c21a6f1801e6';
    const channelSetId2: string = 'd5e798ac-65a4-4aca-bbf4-9843d5d5773f';

    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: businessId,
    }) as any);

    const business2: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: businessId2,
    }) as any);

    const checkout: CheckoutModel = await this.checkoutModel.create({
      _id: checkoutId,
      businessId: business.id,
      default: true,
      name: 'Test',
    } as any);
    business.checkouts.push(checkout  as any);

    const channelSet: ChannelSetModel = await this.channelSetModel.create({
      _id: channelSetId,
      checkout: checkout.id,
      subType: 'sms',
      type: 'api',
    } as any);
    business.channelSets.push(channelSet as any);

    await business.save();

    const checkout2: CheckoutModel = await this.checkoutModel.create({
      _id: checkoutId2,
      businessId: business2.id,
      default: true,
      name: 'Test',
      settings: {
        phoneNumber: '23456789',
      },
    } as any);
    business2.checkouts.push(checkout2 as any);

    const channelSet2: ChannelSetModel = await this.channelSetModel.create({
      _id: channelSetId2,
      checkout: checkout2.id,
      subType: 'sms',
      type: 'api',
    } as any);
    business2.channelSets.push(channelSet2 as any);

    await business.save();
  }
}

export = TestFixture;
