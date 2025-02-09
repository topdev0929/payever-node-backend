import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business/models';
import { InventoryModel, LocationModel } from '../../../src/inventory/models';
import { InventoryFactory, LocationFactory } from '../factories';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

const SKU_1: string = 'testSku1';
const SKU_2: string = 'testSku2';

const PRODUCT_ID_1: string = 'pppppppp-pppp-pppp-pppp-ppppppppppp1';
const PRODUCT_ID_2: string = 'pppppppp-pppp-pppp-pppp-ppppppppppp2';

const INVENTORY_ID_1: string = 'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiii1';
const INVENTORY_ID_2: string = 'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiii2';

const LOCATION_ID_1: string = 'llllllll-llll-llll-llll-lllllllllll1';
const LOCATION_ID_2: string = 'llllllll-llll-llll-llll-lllllllllll2';
const LOCATION_ID_3: string = 'llllllll-llll-llll-llll-lllllllllll3';
const LOCATION_ID_4: string = 'llllllll-llll-llll-llll-lllllllllll4';

class AddStockBySkuFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly inventoryModel: Model<InventoryModel> = this.application.get('InventoryModel');
  private readonly locationModel: Model<LocationModel> = this.application.get('LocationModel');

  public async apply(): Promise<void> {

    // create business
    await this.businessModel.create({ _id: BUSINESS_ID, } as any);


    const inventoryDetail = {
      barcode: 'test_barcode',
      businessId: BUSINESS_ID,
      product: PRODUCT_ID_1,
      isNegativeStockAllowed: true,
      isTrackable: true,
      reserved: 0,
      sku: SKU_1,
      stock: 100,
    }

    // create inventory
    await this.inventoryModel.create(InventoryFactory.create({
      ...inventoryDetail,
      _id: INVENTORY_ID_1,
      product: PRODUCT_ID_1,
      sku: SKU_1,
    }));

    await this.inventoryModel.create(InventoryFactory.create({
      ...inventoryDetail,
      _id: INVENTORY_ID_2,
      product: PRODUCT_ID_2,
      sku: SKU_2,
    }));

    // create locations
    await this.locationModel.create(LocationFactory.create({
      _id: LOCATION_ID_1,
      businessId: BUSINESS_ID,
    }));

    await this.locationModel.create(LocationFactory.create({
      _id: LOCATION_ID_2,
      businessId: BUSINESS_ID,
    }));

    await this.locationModel.create(LocationFactory.create({
      _id: LOCATION_ID_3,
      businessId: BUSINESS_ID,
    }));

    await this.locationModel.create(LocationFactory.create({
      _id: LOCATION_ID_4,
      businessId: BUSINESS_ID,
    }));
  }
  
}

export = AddStockBySkuFixture;
