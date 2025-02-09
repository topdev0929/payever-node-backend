import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../../../../src/business';
import { ChannelSetModel } from '../../../../../../src/channel-set';
import { CheckoutModel } from '../../../../../../src/checkout';
import { ApiCallModel } from '../../../../../../src/common/models';
import {
  ApiCallSchemaName,
  BusinessSchemaName,
  ChannelSetSchemaName,
  CheckoutSchemaName,
} from '../../../../../../src/mongoose-schema';
import { ApiCallFactory, BusinessFactory, CheckoutFactory } from '../../../../../fixture-factories';
import { ChannelSetFactory } from '../../../../../fixture-factories/channel-set.factory';

class TestFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private checkoutModel: Model<CheckoutModel> = this.application.get(getModelToken(CheckoutSchemaName));
  private channelSetModel: Model<ChannelSetModel> = this.application.get(getModelToken(ChannelSetSchemaName));
  private apiCallModel: Model<ApiCallModel> = this.application.get(getModelToken(ApiCallSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = '012c165f-8b88-405f-99e2-82f74339a757';
    const nonDefaultCheckoutId: string = '9edf6c33-a2d4-4f49-bfbd-a4d9386aa058';
    const channelSetIdOne: string = '006388b0-e536-4d71-b1f1-c21a6f1801e6';
    const defaultCheckoutId: string = '04206b2a-a318-40e7-b031-32bbbd879c74';
    const channelSetIdTwo: string = 'a2ca58de-8283-4664-8b63-da31b79cce27';
    const apiCallId: string = 'b5965f9d-5971-4b02-90eb-537a0a6e07c7';

    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: businessId,
    }) as any);

    const nonDefaultCheckout: CheckoutModel = await this.checkoutModel.create(CheckoutFactory.create({
      _id: nonDefaultCheckoutId,
      businessId: business.id,
      default: false,
      name: 'Test',
    }) as any);
    business.checkouts.push(nonDefaultCheckout as any);

    const channelSetOne: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create({
      _id: channelSetIdOne,
      checkout: nonDefaultCheckout.id,
      type: 'non-magento',
    }) as any);
    business.channelSets.push(channelSetOne as any);

    const defaultCheckout: CheckoutModel = await this.checkoutModel.create(CheckoutFactory.create({
      _id: defaultCheckoutId,
      businessId: business.id,
      default: true,
      name: 'Test',
    }) as any);
    business.checkouts.push(defaultCheckout as any as any);

    const channelSetTwo: ChannelSetModel = await this.channelSetModel.create(ChannelSetFactory.create({
      _id: channelSetIdTwo,
      checkout: defaultCheckout.id,
      type: 'non-magento',
    }) as any);
    business.channelSets.push(channelSetTwo as any);

    await this.apiCallModel.create(ApiCallFactory.create({
      _id: apiCallId,
      businessId: business.id,
      channel: 'magento',
      channel_set_id: null,
      order_id: 'some_order_id',
      payment_method: 'santander',
    }) as any);

    await business.save();
  }
}

export = TestFixture;
