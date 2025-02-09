import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../../src/business';
import { ChannelSetModel } from '../../../../src/channel-set';
import { CheckoutModel } from '../../../../src/checkout';
import { BusinessSchemaName, ChannelSetSchemaName, CheckoutSchemaName } from '../../../../src/mongoose-schema';
import { BusinessFactory, CheckoutFactory } from '../../../fixture-factories';
import { ChannelSetFactory } from '../../../fixture-factories/channel-set.factory';

class TestFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private checkoutModel: Model<CheckoutModel> = this.application.get(getModelToken(CheckoutSchemaName));
  private channelSetModel: Model<ChannelSetModel> = this.application.get(getModelToken(ChannelSetSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = 'a803d4c3-c447-4aab-a8c7-c7f184a8e77f';
    const checkoutId: string = '9f12e7bc-ee1a-48de-b3d2-8d49b19f5054';
    const channelSetIdOneShop: string = '69864cec-341b-42a0-8221-37a248c28d38';
    const channelSetIdTwoShop: string = '2a9bc748-ed2a-4065-ae1f-91a398fbd87a';
    const channelSetIdThreeLink: string = '2e04582d-374f-4ea6-ae8d-ce83d9522f9f';

    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: businessId,
    }) as any);

    const checkout: CheckoutModel = await this.checkoutModel.create(CheckoutFactory.create({
      _id: checkoutId,
      businessId: business.id,
      default: true,
      name: 'Checkout',
    }) as any);
    business.checkouts.push(checkout  as any);

    await business.save();

    const channelSetOneShop: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create({
      _id: channelSetIdOneShop,
      checkout: checkout.id,
      name: 'Shop One',
      type: 'shop',
    }) as any);
    business.channelSets.push(channelSetOneShop as any);

    const channelSetTwoShop: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create({
      _id: channelSetIdTwoShop,
      checkout: checkout.id,
      name: 'Shop Two',
      type: 'shop',
    }) as any);
    business.channelSets.push(channelSetTwoShop as any);

    const channelSetThreeLink: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create({
      _id: channelSetIdThreeLink,
      checkout: checkout.id,
      type: 'link',
    }) as any);
    business.channelSets.push(channelSetThreeLink as any);

    await business.save();
  }
}

export = TestFixture;
