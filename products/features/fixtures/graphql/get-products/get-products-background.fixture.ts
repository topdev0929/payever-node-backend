import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { BaseFixture } from '@pe/cucumber-sdk';
import { ProductModel } from '../../../../src/products/models';
import { productFactory, variantFactory, businessFactory } from '../../factories';
import { ProductVariantModel } from '../../../../src/products/models/product-variant.model';
import { ChannelSetModel } from '../../../../src/channel-set/models';
import { BusinessModel, BusinessSchemaName } from '../../../../src/business';

const BUSINESS_ID: string = '21f4947e-929a-11e9-bb05-7200004fe4c0';

class GetProductsBackgroundFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly productModel: Model<ProductModel> = this.application.get('NewProductModel');
  private readonly productVariantModel: Model<ProductVariantModel> = this.application.get('ProductVariantModel');
  private readonly channelSetModel: Model<ChannelSetModel> = this.application.get('ChannelSetModel');

  public async apply(): Promise<void> {
    await this.businessModel.create(businessFactory({
      _id: BUSINESS_ID,
    }));

    await this.channelSetModel.create({
      _id: '11111111-1111-1111-1111-111111111111',
      name: 'pos',
      type: 'pos',
    });

    await this.productModel.create(productFactory({
      businessId: BUSINESS_ID,
      categories: [
        {
          _id: '_id',
          businessId: BUSINESS_ID,
          slug: 'slug',
          title: 'supplement',
        },
      ],
      channelSets: ['11111111-1111-1111-1111-111111111111'],
      price: 3,
      title: 'Salt',
      uuid: '3799bb06-929a-11e9-b5a6-7200004fe4c0',
      condition: 'new',
      brand: 'benz'
    }));

    await this.productModel.create(productFactory({
      businessId: BUSINESS_ID,
      categories: [
        {
          _id: '_id',
          businessId: BUSINESS_ID,
          slug: 'slug',
          title: 'supplement',
        },
      ],
      price: 5,
      title: 'Pepper',
      uuid: 'a482bf57-1aec-4304-8751-4ce5cea603a4',
    }));

    const parentId: string = 'e563339f-0b4c-4aef-92e7-203b9761981c';
    await this.productModel.create(productFactory({
      businessId: BUSINESS_ID,
      categories: [
        {
          _id: '_id',
          businessId: BUSINESS_ID,
          slug: 'slug',
          title: 'food',
        },
      ],
      price: 4,
      title: 'Sugar',
      uuid: parentId,
    }));

    await this.productVariantModel.create(variantFactory({
      businessId: BUSINESS_ID,
      description: 'brown sugar',
      options: [
        {
          name: 'Color',
          value: 'Brown',
        },
      ],
      price: 7,
      product: parentId,
      sku: 'sgrb',
      title: 'brown sugar',
    }));

    await this.productVariantModel.create(variantFactory({
      businessId: BUSINESS_ID,
      description: 'white sugar',
      id: 'some_id_2',
      options: [
        {
          name: 'Color',
          value: 'White',
        },
      ],
      price: 3,
      product: parentId,
      sku: 'sgrw',
      title: 'white sugar',
    }));
  }
}

export = GetProductsBackgroundFixture;
