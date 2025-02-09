// tslint:disable: object-literal-sort-keys
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { ID_OF_EXISTING_BUSINESS } from '../const';
import { IntegrationModel, IntegrationWrapperSubscriptionModel, IntegrationSchemaName, IntegrationWrapperSubscriptionSchemaName } from '../../../src/integration';



class IntegrationWrapperFixture extends BaseFixture {
  protected readonly integrationModel: Model<IntegrationModel> = this.application.get(getModelToken(IntegrationSchemaName));
  protected readonly integrationWrapperSubscriptionModel: Model<IntegrationWrapperSubscriptionModel> =
    this.application.get(getModelToken(IntegrationWrapperSubscriptionSchemaName));
  public async apply(): Promise<void> {
    await this.integrationModel.create({
      _id: '06b3464b-9ed2-4952-9cb8-07aac0108a55',
      allowedBusinesses: [ID_OF_EXISTING_BUSINESS],
      category: `payment`,
      displayOptions: { title: `stripe`, icon: `icon-stripe.png` },
      enabled: true,
      installationOptions: {
        appSupport: '',
        category: `payment`,
        countryList: [],
        description: `pay via stripe`,
        developer: `1`,
        languages: 'en, de',
        links: [],
        optionIcon: `icon-stripe.png`,
        price: '0.00',
        pricingLink: '',
        website: '',
        wrapperType: 'credit_card',
      },
      name: 'stripe',
      order: 1,
      reviews: [],
      scopes: [
        'read_products',
        'write_products',
      ],
      timesInstalled: 1,
      versions: [],
    });

    await this.integrationWrapperSubscriptionModel.create({
      _id: '16b3464b-9ed2-4952-1cb8-07aac0108a56',
      businessId: ID_OF_EXISTING_BUSINESS,
      installed: true,
      wrapperType: 'credit_card',
    });
  }
}

export = IntegrationWrapperFixture;
