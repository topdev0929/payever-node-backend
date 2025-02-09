import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { BaseFixture } from '@pe/cucumber-sdk';
import { BusinessModel, BusinessSchemaName } from '../../src/business';
import { businessFactory } from './factories';

const businessId: string = '36bf8981-8827-4c0c-a645-02d9fc6d72c8';

class BusinessEventsFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));

  public async apply(): Promise<void> {
    await this.businessModel.create(businessFactory.create({_id: businessId}));
  }
}

export = BusinessEventsFixture;
