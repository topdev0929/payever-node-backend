import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business/models';
import { InventoryModel } from '../../../src/inventory/models';
import { InventoryFactory } from '../factories';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const SKU: string = 'testSku';
const PRODUCT_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

class AddStockByProductFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly inventoryModel: Model<InventoryModel> = this.application.get('InventoryModel');

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
    } as any);

    await this.inventoryModel.create(InventoryFactory.create({
      barcode: 'test_barcode',
      businessId: BUSINESS_ID,
      isNegativeStockAllowed: true,
      isTrackable: true,
      product: PRODUCT_ID,
      reserved: 10,
      sku: SKU,
      stock: 20,
    }) as any);
  }
}

export = AddStockByProductFixture;
