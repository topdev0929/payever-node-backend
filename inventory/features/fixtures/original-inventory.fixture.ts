import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../src/business/models';
import { InventoryModel } from '../../src/inventory/models';
import { InventoryFactory } from './factories';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const BUSINESS_ID_2: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const BUSINESS_ID_3: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';
const INVENTORY_ID: string = 'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm';
const INVENTORY_ID_2: string = 'nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn';
const INVENTORY_ID_3: string = 'oooooooo-oooo-oooo-oooo-oooooooooooo';
const TEST_SKU: string = 'test_sku';
const REF_SKU: string = 'ref_sku';
const REF_SKU_2: string = 'ref_sku_2';

class OriginalInventoryFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly inventoryModel: Model<InventoryModel> = this.application.get('InventoryModel');

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
    });
    await this.businessModel.create({
      _id: BUSINESS_ID_2,
    });
    await this.businessModel.create({
      _id: BUSINESS_ID_3,
    });

    await this.inventoryModel.create(InventoryFactory.create({
      _id: INVENTORY_ID,
      barcode: 'test_barcode',
      businessId: BUSINESS_ID,
      isNegativeStockAllowed: true,
      isTrackable: true,
      reserved: 10,
      sku: TEST_SKU,
      stock: 20,
    }));
    await this.inventoryModel.create(InventoryFactory.create({
      _id: INVENTORY_ID_2,
      businessId: BUSINESS_ID_2,
      isNegativeStockAllowed: true,
      isTrackable: true,
      originalInventory: {
        businessId: BUSINESS_ID,
        sku: TEST_SKU,
      },
      sku: REF_SKU,
      stock: 20,
    }));
    await this.inventoryModel.create(InventoryFactory.create({
      _id: INVENTORY_ID_3,
      businessId: BUSINESS_ID_3,
      isNegativeStockAllowed: true,
      isTrackable: true,
      originalInventory: {
        businessId: BUSINESS_ID,
        sku: TEST_SKU,
      },
      sku: REF_SKU_2,
      stock: 20,
    }));
  }
}

export = OriginalInventoryFixture;
