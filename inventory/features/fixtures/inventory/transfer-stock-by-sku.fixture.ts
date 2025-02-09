import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business/models';
import { InventoryModel, InventoryLocationModel } from '../../../src/inventory/models';
import { InventoryFactory, InventoryLocationFactory } from '../factories';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const SKU: string = 'testSku';
const PRODUCT_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const INVENTORY_ID_1: string = 'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiii1';
const INVENTORY_ID_2: string = 'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiii2';
const INVENTORY_LOCATION_ID_1: string = '11111111-1111-1111-1111-111111111111';
const INVENTORY_LOCATION_ID_2: string = '22222222-2222-2222-2222-222222222222';

class TransferStockBySkuFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly inventoryModel: Model<InventoryModel> = this.application.get('InventoryModel');
  private readonly inventoryLocationModel: Model<InventoryLocationModel> = this.application.get('InventoryLocationModel');

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
    } as any);

    await this.inventoryModel.create(InventoryFactory.create({
      _id: INVENTORY_ID_1,
      barcode: 'test_barcode',
      businessId: BUSINESS_ID,
      isNegativeStockAllowed: true,
      isTrackable: true,
      product: PRODUCT_ID,
      reserved: 10,
      sku: SKU,
      stock: 20,
    }) as any);

    await this.inventoryLocationModel.create(InventoryLocationFactory.create({
      _id: INVENTORY_LOCATION_ID_1,
      locationId: 'location_id_1',
      inventoryId: INVENTORY_ID_1,
      stock: 15,
    }));
    
    await this.inventoryLocationModel.create(InventoryLocationFactory.create({
      _id: INVENTORY_LOCATION_ID_2,
      locationId: 'location_id_2',
      inventoryId: INVENTORY_ID_1,
      stock: 5,
    }));
  }
}

export = TransferStockBySkuFixture;
