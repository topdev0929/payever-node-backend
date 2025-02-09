import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { SampleProductsModel } from '../../../src/sample-products/models';

const BUSINESS_ID_1: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1';
const BUSINESS_ID_2: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2';
const SAMPLE_PRODUCT_ID_1: string = 'pppppppp-pppp-pppp-pppp-ppppppppppp1';
const SAMPLE_PRODUCT_ID_2: string = 'pppppppp-pppp-pppp-pppp-ppppppppppp2';
const SAMPLE_PRODUCT_ID_3: string = 'pppppppp-pppp-pppp-pppp-ppppppppppp3';
const SAMPLE_PRODUCT_ID_4: string = 'pppppppp-pppp-pppp-pppp-ppppppppppp4';


class AdminSampleProductsFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<SampleProductsModel> = this.application.get('SampleProductsModel');

    await model.create({
      _id: SAMPLE_PRODUCT_ID_1,
      businessId: BUSINESS_ID_1,
      description: 'Some product description',
      price: 1000,
      title: 'Some product',
    });

    await model.create({
      _id: SAMPLE_PRODUCT_ID_2,
      businessId: BUSINESS_ID_1,
      price: 5000,
    });

    await model.create({
      _id: SAMPLE_PRODUCT_ID_3,
      businessId: BUSINESS_ID_2,
      price: 1000,
    });

    await model.create({
      _id: SAMPLE_PRODUCT_ID_4,
      businessId: BUSINESS_ID_2,
      price: 5000,
    });
  }
}

export = AdminSampleProductsFixture;
