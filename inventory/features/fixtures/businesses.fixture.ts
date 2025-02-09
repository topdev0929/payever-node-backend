import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { InventoryModel } from '../../src/inventory/models';
import { BusinessModel } from '../../src/business/models';

class InventoryFixture extends BaseFixture {
  private readonly model: Model<BusinessModel> = this.application.get('BusinessModel');

  public async apply(): Promise<void> {
    await this.model.create({
      _id: '77452736-d7d3-4c9c-bcd2-f4d9f1c477f1',
      name: 'business',
    } as any);
  }
}

export = InventoryFixture;
