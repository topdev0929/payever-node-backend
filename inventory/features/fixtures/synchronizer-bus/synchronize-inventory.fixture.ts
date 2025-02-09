import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { InventoryModel } from '../../../src/inventory/models';
import { BusinessModel } from '../../../src/business/models';

const ANOTHER_BUSINESS_ID: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ANOTHER_BUSINESS_SKU: string = 'another_sku';

class SynchronizeInventoryFixture extends BaseFixture {
  private readonly inventoryModel: Model<InventoryModel> = this.application.get('InventoryModel');
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');

  public async apply(): Promise<void> {

    await this.businessModel.create({
      _id: BUSINESS_ID,
    } as any);

    await this.businessModel.create({
      _id: ANOTHER_BUSINESS_ID,
    } as any);

    for (let i: number = 1; i <= 5; i++) {
      await this.inventoryModel.create({
        barcode: '1234',
        businessId: BUSINESS_ID,
        isNegativeStockAllowed: false,
        isTrackable: true,
        product: 'product',
        reserved: 0,
        sku: `sku_${i}`,
        stock: 0,
      } as any);
    }

    await this.inventoryModel.create({
      _id: '111',
      barcode: '1234',
      businessId: '1234',
      isNegativeStockAllowed: false,
      isTrackable: true,
      product: 'product',
      reserved: 0,
      sku: ANOTHER_BUSINESS_SKU,
      stock: 0,
    } as any);
  }
}

export = SynchronizeInventoryFixture;
