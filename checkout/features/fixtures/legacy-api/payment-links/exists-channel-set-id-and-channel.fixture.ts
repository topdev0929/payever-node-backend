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
    const channelSetId: string = '006388b0-e536-4d71-b1f1-c21a6f1801e6';
    const channelSetIdLink: string = 'ed2e320c-7031-413e-b2ca-ce4c54ca5466';

    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: businessId,
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
        callbacks: {
          cancelUrl: 'http://checkout.settings/cancelUrl',
          customerRedirectUrl: 'http://checkout.settings/customerRedirectUrl',
          failureUrl: 'http://checkout.settings/failureUrl',
          noticeUrl: 'http://checkout.settings/noticeUrl',
          pendingUrl: 'http://checkout.settings/pendingUrl',
          successUrl: 'http://checkout.settings/successUrl',
        },
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

    await business.save();
  }
}

export = TestFixture;
