import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

const BUSINESS_ID: string = '9a9da687-ec9b-4b4d-bf8d-396cfa83f5a1';


class PutFieImportFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
      name: 'test',
    });
  }
}

export = PutFieImportFixture;
