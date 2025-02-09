import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business/models';
import { InventoryModel } from '../../../src/inventory/models';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const PRODUCT_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const SKU: string = 'test_sku';

class CreateOrderTrackableInventoryNegativeStockNotAllowedFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly inventoryModel: Model<InventoryModel> = this.application.get('InventoryModel');

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
    } as any);

    await this.inventoryModel.create({
      barcode: 'test_barcode',
      businessId: BUSINESS_ID,
      isNegativeStockAllowed: false,
      isTrackable: true,
      product: PRODUCT_ID,
      reserved: 0,
      sku: SKU,
      stock: 20,
    } as any);
  }
}

export = CreateOrderTrackableInventoryNegativeStockNotAllowedFixture;
