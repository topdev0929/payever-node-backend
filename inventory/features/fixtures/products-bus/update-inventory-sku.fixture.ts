import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { InventoryModel } from '../../../src/inventory/models';
import { BusinessModel } from '../../../src/business/models';

const INVENTORY_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const SKU: string = 'test_sku';

class UpdateInventorySkuFixture extends BaseFixture {
  private readonly model: Model<InventoryModel> = this.application.get('InventoryModel');
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
      name: 'Some business',
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
  }
}

export = UpdateInventorySkuFixture;
