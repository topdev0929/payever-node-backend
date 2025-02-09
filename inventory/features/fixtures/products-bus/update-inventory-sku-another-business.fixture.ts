import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { InventoryModel } from '../../../src/inventory/models';
import { BusinessModel } from '../../../src/business/models';

const INVENTORY_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const ANOTHER_INVENTORY_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ANOTHER_BUSINESS_ID: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
const SKU: string = 'test_sku';

class UpdateInventorySkuAnotherBusinessFixture extends BaseFixture {
  private readonly model: Model<InventoryModel> = this.application.get('InventoryModel');
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
      name: 'Some business',
    } as any);

    await this.businessModel.create({
      _id: ANOTHER_BUSINESS_ID,
      name: 'Another business',
    } as any);

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
      businessId: ANOTHER_BUSINESS_ID,
      isNegativeStockAllowed: false,
      isTrackable: true,
      product: 'product',
      reserved: 0,
      sku: SKU,
      stock: 0,
    } as any);
  }
}

export = UpdateInventorySkuAnotherBusinessFixture;
