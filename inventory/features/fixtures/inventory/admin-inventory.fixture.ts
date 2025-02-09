import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business/models';
import { InventoryModel } from '../../../src/inventory/models';
import { InventoryFactory } from '../factories';

const BUSINESS_ID_1: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1';
const BUSINESS_ID_2: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2';
const INVENTORY_ID_1: string = 'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiii1';
const INVENTORY_ID_2: string = 'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiii2';
const PRODUCT_ID: string = 'product-id';

class GetInventoryByBusinessFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly inventoryModel: Model<InventoryModel> = this.application.get('InventoryModel');

  public async apply(): Promise<void> {

    await this.businessModel.create({ _id: BUSINESS_ID_1, } as any);
    await this.businessModel.create({ _id: BUSINESS_ID_2, } as any);

    await this.inventoryModel.create(InventoryFactory.create({
      _id: INVENTORY_ID_1,
      barcode: `test_barcode`,
      businessId: BUSINESS_ID_1,
      isNegativeStockAllowed: true,
      isTrackable: true,
      reserved: 1,
      sku: `testSku`,
      stock: 10,
      product: PRODUCT_ID,
    }) as any);

    await this.inventoryModel.create(InventoryFactory.create({
      _id: INVENTORY_ID_2,
      barcode: `test_barcode`,
      businessId: BUSINESS_ID_2,
      isNegativeStockAllowed: true,
      isTrackable: true,
      reserved: 1,
      sku: `testSku`,
      stock: 10,
      product: PRODUCT_ID,
    }) as any);
  }
}

export = GetInventoryByBusinessFixture;
