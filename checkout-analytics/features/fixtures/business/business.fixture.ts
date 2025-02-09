import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';

import { BusinessModel } from '../../../src/business/models';
import { BusinessSchemaName } from '../../../src/business/schemas';
import { BusinessFactory } from '../../fixture-factories/business.factory';

class TestFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> =
    this.application.get(getModelToken(BusinessSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = 'c4f3df1c-2167-4e1e-b85f-d065570f4494';

    const businessData: BusinessModel =
      await this.businessModel.create(BusinessFactory.create({
        _id: businessId,
      }));

    await businessData.save();
  }
}

export = TestFixture;
