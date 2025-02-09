import { ProductRecommendationsModel } from '../../../../src/products/models';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';

const someBusinessId: string = '21f4947e-929a-11e9-bb05-7200004fe4c0';
const someProductId: string = 'd38fffda-ccc1-4708-a06d-d57127f37b1f';

class GetRecommendationsFixture extends BaseFixture {
  private readonly recommendationsModel: Model<ProductRecommendationsModel> = this.application.get('ProductRecommendationsModel');

  public async apply(): Promise<void> {
    await this.recommendationsModel.create({
      businessId: someBusinessId,
      productId: someProductId,
      recommendations : [
        {
          id : 'e563339f-0b4c-4aef-92e7-203b9761981c',
          name : 'Arts & Crafts',
        },
        {
          id : 'a482bf57-1aec-4304-8751-4ce5cea603a4',
          name : 'Baby',
        },
      ],
      sku: 'SKU1234',
      tag : 'byCategory',
    });
  }
}

export = GetRecommendationsFixture;
