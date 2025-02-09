import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../../../src/business';
import { ChannelSetModel } from '../../../../../src/channel-set';
import { CheckoutModel } from '../../../../../src/checkout';
import { BusinessSchemaName, ChannelSetSchemaName, CheckoutSchemaName } from '../../../../../src/mongoose-schema';
import { BusinessFactory, CheckoutFactory } from '../../../../fixture-factories';
import { ChannelSetFactory } from '../../../../fixture-factories/channel-set.factory';

class TestFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private checkoutModel: Model<CheckoutModel> = this.application.get(getModelToken(CheckoutSchemaName));
  private channelSetModel: Model<ChannelSetModel> = this.application.get(getModelToken(ChannelSetSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = 'a803d4c3-c447-4aab-a8c7-c7f184a8e77f';
    const checkoutId: string = '9f12e7bc-ee1a-48de-b3d2-8d49b19f5054';
    const channelSetId: string = 'a888336c-fe1f-439c-b13c-f351db6bbc2e';

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

    await this.channelSetModel.create(ChannelSetFactory.create({
      _id: channelSetId,
      type: 'shop',
    }) as any);
  }
}

export = TestFixture;
