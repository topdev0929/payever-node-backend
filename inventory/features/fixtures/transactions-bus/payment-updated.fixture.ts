import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business/models';
import { InventoryModel, OrderModel, ReservationModel } from '../../../src/inventory/models';
import { InventoryFactory, OrderFactory, ReservationFactory } from '../factories';
import { OrderStatusEnum } from '../../../src/inventory/enums';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ORDER_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const FLOW_ID: string = 'ffffffff-ffff-ffff-ffff-ffffffffffff';
const TRANSACTION_ID: string = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
const SKU: string = 'test_sku';

class PaymentFlowUpdatedOrderAlreadyHasFlowFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly orderModel: Model<OrderModel> = this.application.get('OrderModel');
  private readonly reservationModel: Model<ReservationModel> = this.application.get('ReservationModel');
  private readonly inventoryModel: Model<InventoryModel> = this.application.get('InventoryModel');

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
    } as any);

    const inventory: InventoryModel = await this.inventoryModel.create(InventoryFactory.create({
      businessId: BUSINESS_ID,
      isNegativeStockAllowed: false,
      isTrackable: true,
      reserved: 10,
      sku: SKU,
      stock: 10,
    }) as any);

    await this.orderModel.create(OrderFactory.create({
      _id: ORDER_ID,
      businessId: BUSINESS_ID,
      flow: FLOW_ID,
      reservations: [await this.createReservation(inventory, 10)],
      status: OrderStatusEnum.TEMPORARY,
      transaction: TRANSACTION_ID,
    }) as any);
  }

  private async createReservation(inventory: InventoryModel, quantity: number): Promise<ReservationModel> {
    return this.reservationModel.create(ReservationFactory.create({
      businessId: BUSINESS_ID,
      inventory,
      quantity,
    }) as any);
  }
}

export = PaymentFlowUpdatedOrderAlreadyHasFlowFixture;
