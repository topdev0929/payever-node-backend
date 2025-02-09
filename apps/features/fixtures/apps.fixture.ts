// tslint:disable: object-literal-sort-keys
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseFixture } from '@pe/cucumber-sdk';
import { BusinessInterface, BusinessSchemaName } from '@pe/business-kit';
import { AppInterface, AppSubscriptionInterface, CategoryInterface } from '../../src/apps/interfaces';
import { AppSchemaName, AppSubscriptionSchemaName, CategorySchemaName } from '../../src/apps/schemas';

class AppFixture extends BaseFixture {
  private readonly appModel: Model<AppInterface> =
    this.application.get(getModelToken(AppSchemaName));
  private readonly appSubscriptionModel: Model<AppSubscriptionInterface> =
    this.application.get(getModelToken(AppSubscriptionSchemaName));
  private readonly businessModel: Model<BusinessInterface> =
    this.application.get(getModelToken(BusinessSchemaName));
  private readonly categoryModel: Model<CategoryInterface> =
    this.application.get(getModelToken(CategorySchemaName));

  public async apply(): Promise<void> {
    const BUSINESS_ID: string = '347e1cae-24f4-476f-bd1e-2b4c307949b9';
    const APP_ID_1: string = 'a5ab9193-e02b-4aed-b75e-f9f3a5ced081';
    const APP_ID_2: string = 'dbfc49cf-9b9a-4fa6-9448-62f63eab5375';
    const USER_ID: string = '08a3fac8-43ef-4998-99aa-cabc97a39261';

    await this.businessModel.create({
      _id: BUSINESS_ID,
      name: 'Test Business',
    });

    await this.categoryModel.create({
      name: 'shippings',
    });
    await this.categoryModel.create({
      name: 'social',
    });

    await this.appModel.create({
      _id: APP_ID_1,
      key: 'facebook',
      category: 'social',
      title: 'Facebook Integration',

      appUrl: 'https://reza.com',
      events: [
        'product.created',
        'product.updated',
        'product.deleted',
      ],

      owner: USER_ID,
    });

    await this.appModel.create({
      _id: APP_ID_2,
      key: 'dhl',
      category: 'shippings',
      title: 'DHL shipping integration',
      appUrl: 'https://reza.com',
      owner: USER_ID,
    });

    await this.appSubscriptionModel.create({
      _id: 'a5ab9193-e02b-4aed-b75e-f9f3a5ced081',
      appId: APP_ID_1,
      businessId: BUSINESS_ID,
      installed: true,
    });
  }
}

export = AppFixture;
