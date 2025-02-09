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
    const channelSetIdLink: string = 'ed2e320c-7031-413e-b2ca-ce4c54ca5466';
    const channelSetIdEmail: string = '5878ac08-dd8e-4d1c-90dc-4989bdf39f63';
    const channelSetIdSms: string = '6d051222-547b-4d31-8f85-2e88e1d58916';
    const channelSetId2: string = 'd5e798ac-65a4-4aca-bbf4-9843d5d5773f';
    const channelSetSubTypeId: string = '49b1fe4f-350d-49ff-905a-e36d2dbdd886';
    const channelSetId3: string = '86e7ce41-eca0-4f13-982c-e6344e4061cf';

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
      settings: {
        languages: [
          {
            active: true,
            code: 'es',
            isDefault: false,
            name: 'ES',
          },
          {
            active: true,
            code: 'de',
            isDefault: true,
            name: 'DE',
          },
        ],
        phoneNumber: '23452345678',
      },
    } as any);
    business.checkouts.push(checkout  as any);

    const channelSet: ChannelSetModel = await this.channelSetModel.create({
      _id: channelSetId,
      checkout: checkout.id,
      type: 'api',
    } as any);
    business.channelSets.push(channelSet as any);

    const channelSetLink: ChannelSetModel = await this.channelSetModel.create({
      _id: channelSetIdLink,
      checkout: checkout.id,
      type: 'link',
    } as any);
    business.channelSets.push(channelSetLink as any);

    const channelSetEmail: ChannelSetModel = await this.channelSetModel.create({
      _id: channelSetIdEmail,
      checkout: checkout.id,
      subType: 'email',
      type: 'api',
    } as any);
    business.channelSets.push(channelSetEmail as any);

    const channelSetSms: ChannelSetModel = await this.channelSetModel.create({
      _id: channelSetIdSms,
      checkout: checkout.id,
      subType: 'sms',
      type: 'api',
    } as any);
    business.channelSets.push(channelSetSms as any);

    const channelSetSubType: ChannelSetModel = await this.channelSetModel.create({
      _id: channelSetSubTypeId,
      checkout: checkout.id,
      subType: 'in_store',
      type: 'api',
    } as any);
    business.channelSets.push(channelSetSubType as any);

    const channelSetPos: ChannelSetModel = await this.channelSetModel.create({
      _id: channelSetId3,
      checkout: checkout.id,
      type: 'pos',
    } as any);
    business.channelSets.push(channelSetPos as any);

    await business.save();

    const checkout2: CheckoutModel = await this.checkoutModel.create({
      _id: checkoutId2,
      businessId: business2.id,
      default: true,
      name: 'Test',
    } as any);
    business2.checkouts.push(checkout2 as any);

    const channelSet2: ChannelSetModel = await this.channelSetModel.create({
      _id: channelSetId2,
      checkout: checkout2.id,
      type: 'api',
    } as any);
    business2.channelSets.push(channelSet2 as any);

    await business.save();
  }
}

export = TestFixture;
