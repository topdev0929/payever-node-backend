import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';

import { SampleProductsModel } from '../../src/sample-products/models';

class SampleProductsFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<SampleProductsModel> = this.application.get('SampleProductsModel');

    await model.create({
      _id: '3799bb06-929a-11e9-b5a6-7200004fe4c0',
      description: 'Some product description',
      price: 1000,
      title: 'Some product',
    });

    await model.create({
      _id: '4e58fe33-97d3-41d0-a789-cf43a11e469f',
      price: 5000,
    });

    await model.create({
      _id: 'e563339f-0b4c-4aef-92e7-203b9761981c',
      price: 1000,
    });

    await model.create({
      _id: 'a482bf57-1aec-4304-8751-4ce5cea603a4',
      price: 5000,
    });
  }
}

export = SampleProductsFixture;
