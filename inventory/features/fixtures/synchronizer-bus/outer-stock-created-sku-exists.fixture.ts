import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business/models';
import { InventoryFactory } from '../factories';
import { InventoryModel } from '../../../src/inventory/models';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const SKU: string = 'test_sku';

class OuterStockCreatedSkuExistsFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly inventoryModel: Model<InventoryModel> = this.application.get('InventoryModel');

  public async apply(): Promise<void> {

    await this.businessModel.create({
      _id: BUSINESS_ID,
    } as any);

    await this.inventoryModel.create(InventoryFactory.create({
      businessId: BUSINESS_ID,
      sku: SKU,
      stock: 10,
      origin: 'ebay',
      isNegativeStockAllowed: false,
    }) as any);
  }
}

export = OuterStockCreatedSkuExistsFixture;
