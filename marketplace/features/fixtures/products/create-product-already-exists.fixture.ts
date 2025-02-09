import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessFactory, ChannelFactory, ProductFactory } from '../factories';
import { BusinessModel, ProductModel } from '../../../src/marketplace/interfaces';
import { BusinessSchemaName, ProductSchemaName } from '../../../src/marketplace/schemas';
import { ChannelModel, ChannelSchemaName } from '@pe/channels-sdk';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const PRODUCT_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

class CreateProductAlreadyExistsFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly productModel: Model<ProductModel> = this.application.get(getModelToken(ProductSchemaName));
  private readonly channelModel: Model<ChannelModel> = this.application.get(getModelToken(ChannelSchemaName));

  public async apply(): Promise<void> {
    await this.channelModel.create(ChannelFactory.create({ }));

    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      name: 'test',
    }));

    await this.productModel.create(ProductFactory.create({
      _id: PRODUCT_ID,
      businessId: BUSINESS_ID,
      price: 100,
      title: 'product',
    }));
  }
}

export = CreateProductAlreadyExistsFixture;
