import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { InventoryModel } from '../../src/inventory/models';
import { v4 as uuid } from 'uuid/interfaces';

class InventoryFixture extends BaseFixture {
  private readonly model: Model<InventoryModel> = this.application.get('InventoryModel');

  public async apply(): Promise<void> {
    await this.model.create({
      _id: '8ec5afab-ae3d-4154-b401-ee1558817d30',
      product: 'product',
      businessId: '77452736-d7d3-4c9c-bcd2-f4d9f1c477f1',
      sku: '1234',
      barcode: '1234',
      stock: 5,
      reserved: 4,
      isTrackable: true,
      isNegativeStockAllowed: false,
    } as any);
  }
}

export = InventoryFixture;
