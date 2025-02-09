import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../../../src/business/models';
import { BusinessSchemaName } from '../../../../../src/mongoose-schema';
import { BusinessFactory } from '../../../../fixture-factories';

class TestFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = 'a803d4c3-c447-4aab-a8c7-c7f184a8e77f';

    await this.businessModel.create(BusinessFactory.create({
      _id: businessId,
      currency: 'EUR',
      name: 'Old Business Name',
    }) as any);
  }
}

export = TestFixture;
