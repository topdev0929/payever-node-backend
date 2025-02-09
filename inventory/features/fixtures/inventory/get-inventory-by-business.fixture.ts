import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business/models';
import { InventoryModel } from '../../../src/inventory/models';
import { InventoryFactory } from '../factories';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

class GetInventoryByBusinessFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly inventoryModel: Model<InventoryModel> = this.application.get('InventoryModel');

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
    } as any);

    for (let i: number = 1; i <= 3; i++) {
      await this.inventoryModel.create(InventoryFactory.create({
        barcode: `test_barcode_${i}`,
        businessId: BUSINESS_ID,
        isNegativeStockAllowed: true,
        isTrackable: true,
        reserved: i,
        sku: `testSku_${i}`,
        stock: i + 10,
      }) as any);
    }
  }
}

export = GetInventoryByBusinessFixture;
