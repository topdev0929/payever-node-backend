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
    const checkoutId: string = '04206b2a-a318-40e7-b031-32bbbd879c74';
    const channelSetSubTypeEmailId: string = 'dbd1a237-a55e-419a-b582-ae3b22e161dc';

    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: businessId,
    }) as any);

    const checkout: CheckoutModel = await this.checkoutModel.create({
      _id: checkoutId,
      businessId: business.id,
      default: true,
      name: 'Test',
    } as any);
    business.checkouts.push(checkout  as any);

    const channelSetSubTypeEmail: ChannelSetModel = await this.channelSetModel.create({
      _id: channelSetSubTypeEmailId,
      checkout: checkout.id,
      subType: 'qr',
      type: 'api',
    } as any);
    business.channelSets.push(channelSetSubTypeEmail as any);

    await business.save();
  }
}

export = TestFixture;
