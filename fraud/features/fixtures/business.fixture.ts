/* eslint-disable-object-literal-sort-keys */
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { BusinessFactory } from '../fixture-factories';

class TestFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = '02c50fb6-3fbe-4941-81bc-f3ecceed9ced';

    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: businessId,
    }) as any);

    await business.save();
  }
}

export = TestFixture;
