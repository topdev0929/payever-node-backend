import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseFixture } from '@pe/cucumber-sdk';
import { BusinessProductModel, BusinessProductIndustryModel } from '../../src/business/interfaces/entities';
import { BusinessProductIndustrySchemaName, BusinessProductSchemaName } from '../../src/business/schemas';

class BusinessProductsFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const businessIndustryModel: Model<BusinessProductIndustryModel> =
      this.application.get(getModelToken(BusinessProductIndustrySchemaName));

    await businessIndustryModel.create(
      {
        _id: '3512fbfe-91a0-11e9-b480-7200004fe4c0',
        code: '123',
        industries: [],
        order: 1,
      },
    );

    await businessIndustryModel.create(
      {
        _id: '79f75166-91a0-11e9-a799-7200004fe4c0',
        code: '456',
        order: 2,
      },
    );

    await businessIndustryModel.create(
      {
        _id: '842a717c-91a0-11e9-b28a-7200004fe4c0',
        code: '789',
        industries: [],
        order: 3,
      },
    );

    const businessProductModel: Model<BusinessProductModel> =
      this.application.get(getModelToken(BusinessProductSchemaName));

    await businessProductModel.create(
      {
        _id: '0eff50bc-91a4-11e9-a520-7200004fe4c0',
        code: '123456',
        slug: 'slug',
        industry: '79f75166-91a0-11e9-a799-7200004fe4c0',
      },
    );
  }
}

export = BusinessProductsFixture;
