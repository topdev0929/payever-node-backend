import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { InventoryModel } from '../../../src/inventory/models';

const INVENTORY_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const ANOTHER_INVENTORY_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const SKU: string = 'test_sku';
const ANOTHER_SKU: string = 'another_sku';

class UpdateInventorySkuAlreadyExistsFixture extends BaseFixture {
  private readonly model: Model<InventoryModel> = this.application.get('InventoryModel');

  public async apply(): Promise<void> {
    await this.model.create({
      _id: INVENTORY_ID,
      barcode: '1234',
      businessId: BUSINESS_ID,
      isNegativeStockAllowed: false,
      isTrackable: true,
      product: 'product',
      reserved: 0,
      sku: SKU,
      stock: 0,
    } as any);

    await this.model.create({
      _id: ANOTHER_INVENTORY_ID,
      barcode: '1234',
      businessId: BUSINESS_ID,
      isNegativeStockAllowed: false,
      isTrackable: true,
      product: 'product',
      reserved: 0,
      sku: ANOTHER_SKU,
      stock: 0,
    } as any);

    await this.model.create({
      _id: '111',
      barcode: '1234',
      businessId: '1234',
      isNegativeStockAllowed: false,
      isTrackable: true,
      product: 'product',
      reserved: 0,
      sku: ANOTHER_SKU,
      stock: 0,
    } as any);
  }
}

export = UpdateInventorySkuAlreadyExistsFixture;
