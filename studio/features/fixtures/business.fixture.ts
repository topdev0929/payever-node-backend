import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { BusinessModel } from '../../src/business/models';
import { BusinessSchemaName } from '../../src/business/schemas';

const BUSINESS_ID: string = '08d30292-0b3c-4b5d-a6ec-93ba43d6c81d';
const BUSINESS_ID2: string = '3b1eb897-a009-4ff6-a850-3b1d3399f147';
const SAMPLE_BUSINESS_ID: string = '78f54add-6317-4899-816f-a7fbc70f460b';

class BusinessFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));

  public async apply(): Promise<void> {
    const business: any[] = [
      {
        _id: BUSINESS_ID,
        name: "business test.jpg",
      },
      {
        _id: BUSINESS_ID2,
        name: "business test.jpg 2",
      },
      {
        _id: SAMPLE_BUSINESS_ID,
        name: "business sample",
      },
    ]
    await this.businessModel.create(business);
  }
}

export = BusinessFixture;
