import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { InventoryModel } from '../../../src/inventory/models';

const INVENTORY_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const SKU: string = 'test_sku';

class RemoveInventoryWithNonZeroStockFixture extends BaseFixture {
  private readonly model: Model<InventoryModel> = this.application.get('InventoryModel');

  public async apply(): Promise<void> {
    await this.model.create({
      _id: INVENTORY_ID,
      barcode: '1234',
      businessId: BUSINESS_ID,
      isNegativeStockAllowed: false,
      isTrackable: true,
      product: 'product',
      reserved: 2,
      sku: SKU,
      stock: 0,
    } as any);
  }
}

export = RemoveInventoryWithNonZeroStockFixture;
