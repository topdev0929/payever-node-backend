import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business/models';

class CreateInventorySkuNotExistsFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    } as any);
  }
}

export = CreateInventorySkuNotExistsFixture;
