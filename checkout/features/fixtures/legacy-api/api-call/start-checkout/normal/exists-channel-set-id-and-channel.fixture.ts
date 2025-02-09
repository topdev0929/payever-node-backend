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
import { ApiCallFactory, BusinessFactory } from '../../../../../fixture-factories';
import { CartItemTypeEnum } from '../../../../../../src/common/enum';

class TestFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private checkoutModel: Model<CheckoutModel> = this.application.get(getModelToken(CheckoutSchemaName));
  private channelSetModel: Model<ChannelSetModel> = this.application.get(getModelToken(ChannelSetSchemaName));
  private apiCallModel: Model<ApiCallModel> = this.application.get(getModelToken(ApiCallSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = '012c165f-8b88-405f-99e2-82f74339a757';
    const checkoutId: string = '04206b2a-a318-40e7-b031-32bbbd879c74';
    const channelSetId: string = '006388b0-e536-4d71-b1f1-c21a6f1801e6';
    const apiCallId: string = 'b5965f9d-5971-4b02-90eb-537a0a6e07c7';

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

    const channelSet: ChannelSetModel = await this.channelSetModel.create({
      _id: channelSetId,
      checkout: checkout.id,
      type: 'magento',
    } as any);
    business.channelSets.push(channelSet as any);

    await this.apiCallModel.create(ApiCallFactory.create({
      _id: apiCallId,
      businessId: business.id,
      channel: 'magento',
      channel_set_id: channelSet.id,
      customer_redirect_url: 'http://test.com/customer-redirect',
      order_id: 'some_order_id',
      payment_method: 'santander',
      success_url: 'http://test.com/success',
      salutation: '',
      first_name: 'Test',
      last_name: 'Test',
      street: 'Feldstrasse 21',
      zip: '12345',
      country: 'DE',
      city: 'Hamburg',
      address_line_2: 'package station',
      hide_imprint: true,
      hide_logo: true,
      footer_urls: {
        disclaimer: 'https://disclaimer.url',
        logo: 'https://logo.url',
        privacy: 'https://privacy.url',
        support: 'https://support.url',
      },
      cart: [
        {
          type: CartItemTypeEnum.physical,
          price: 1010,
          name: 'iPhone',
          quantity: 1,
          identifier: 'iph123',
          total_discount_amount: 10,
        },
      ],
    }) as any);

    await business.save();
  }
}

export = TestFixture;
