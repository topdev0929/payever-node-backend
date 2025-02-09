import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessFactory, ChannelFactory, ProductFactory } from '../factories';
import { ProductModel } from '../../../src/subscriptions/models';
import { BusinessModel } from '../../../src/business';
import { ChannelModel, ChannelSchemaName } from '@pe/channels-sdk';
import { getModelToken } from '@nestjs/mongoose';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const PRODUCT_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

class CreateSubscriptionPlanFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly productModel: Model<ProductModel> = this.application.get('ProductModel');
  private readonly channelModel: Model<ChannelModel> = this.application.get(getModelToken(ChannelSchemaName));

  public async apply(): Promise<void> {
    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      currency: 'EUR',
    }));

    await this.channelModel.create(ChannelFactory.create({ }));

    await this.productModel.create(ProductFactory.create({
      _id: PRODUCT_ID,
      businessId: BUSINESS_ID,
      price: 100,
      title: 'product',
    }));
  }
}

export = CreateSubscriptionPlanFixture;
