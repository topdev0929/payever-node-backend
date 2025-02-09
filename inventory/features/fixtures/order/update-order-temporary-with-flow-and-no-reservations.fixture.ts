import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business/models';
import { OrderStatusEnum } from '../../../src/inventory/enums';
import { InventoryModel, OrderModel } from '../../../src/inventory/models';
import { InventoryFactory, OrderFactory } from '../factories';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ORDER_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const FLOW_ID: string = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

const OUT_OF_STOCK_SKU: string = 'out_of_stock_sku';

class UpdateOrderTemporaryWithFlowAndReservationsFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly orderModel: Model<OrderModel> = this.application.get('OrderModel');
  private readonly inventoryModel: Model<InventoryModel> = this.application.get('InventoryModel');

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
    } as any);

    await this.inventoryModel.create(InventoryFactory.create({
      businessId: BUSINESS_ID,
      isNegativeStockAllowed: false,
      isTrackable: true,
      reserved: 0,
      sku: OUT_OF_STOCK_SKU,
      stock: 0,
    }) as any);

    await this.orderModel.create(OrderFactory.create({
      _id: ORDER_ID,
      businessId: BUSINESS_ID,
      flow: FLOW_ID,
      reservations: [],
      status: OrderStatusEnum.TEMPORARY,
    }) as any);
  }
}

export = UpdateOrderTemporaryWithFlowAndReservationsFixture;
