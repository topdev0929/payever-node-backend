import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { BaseFixture } from '@pe/cucumber-sdk';
import { businessFactory } from '../../factories';
import { BusinessModel, BusinessSchemaName } from '../../../../src/business';

const BUSINESS_ID: string = '21f4947e-929a-11e9-bb05-7200004fe4c0';

class GetProductsBusinessFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));

  public async apply(): Promise<void> {
    await this.businessModel.create(businessFactory({
      _id: BUSINESS_ID,
    }));
  }
}

export = GetProductsBusinessFixture;
