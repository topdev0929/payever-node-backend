import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';

import { ContentModel } from '../../src/contents';
import { ID_OF_EXISTING_BUSINESS } from './const';

class ContentsFixture extends BaseFixture {
  protected readonly contentModel: Model<ContentModel> = this.application.get(`ContentModel`);

  public async apply(): Promise<void> {
    await this.contentModel.create({
      _id: '1d78b846-09d7-4e8b-b57b-2836fb6cd362',
      businessId: null,
      icon: '#sample-icon',
      name: 'Shop/Add',
      url: 'https://payever.com/shop/add',
    });

    await this.contentModel.create({
      _id: '984742e6-e584-4ad5-af0b-395fb55eb92e',
      businessId: ID_OF_EXISTING_BUSINESS,
      icon: '#sample-icon',
      name: 'Shop/Edit',
      url: 'https://payever.com/shop/edit',
    });
  }
}

export = ContentsFixture;
