import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business/models';
import { InventoryModel, OrderModel, ReservationModel } from '../../../src/inventory/models';
import { InventoryFactory, OrderFactory, ReservationFactory } from '../factories';
import { OrderStatusEnum } from '../../../src/inventory/enums';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ORDER_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const FLOW_ID: string = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

const ADD_NEW_SKU: string = 'add_new_sku';
const INCREASE_QUANTITY_SKU: string = 'increase_quantity_sku';
const DECREASE_QUANTITY_SKU: string = 'decrease_quantity_sku';
const REMOVE_FROM_ORDER_SKU: string = 'remove_from_sku';

class UpdateOrderTemporaryWithFlowAndReservationsFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly orderModel: Model<OrderModel> = this.application.get('OrderModel');
  private readonly inventoryModel: Model<InventoryModel> = this.application.get('InventoryModel');
  private readonly reservationModel: Model<ReservationModel> = this.application.get('ReservationModel');

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
    } as any);

    await this.inventoryModel.create(InventoryFactory.create({
      businessId: BUSINESS_ID,
      isNegativeStockAllowed: false,
      isTrackable: true,
      reserved: 0,
      sku: ADD_NEW_SKU,
      stock: 10,
    }) as any);

    const createInventoriesPromises: Array<Promise<any>> = [
      this.inventoryModel.create(InventoryFactory.create({
        businessId: BUSINESS_ID,
        isNegativeStockAllowed: false,
        isTrackable: true,
        reserved: 10,
        sku: INCREASE_QUANTITY_SKU,
        stock: 10,
      }) as any),

      this.inventoryModel.create(InventoryFactory.create({
        businessId: BUSINESS_ID,
        isNegativeStockAllowed: false,
        isTrackable: true,
        reserved: 10,
        sku: DECREASE_QUANTITY_SKU,
        stock: 10,
      }) as any),

      this.inventoryModel.create(InventoryFactory.create({
        businessId: BUSINESS_ID,
        isNegativeStockAllowed: false,
        isTrackable: true,
        reserved: 10,
        sku: REMOVE_FROM_ORDER_SKU,
        stock: 10,
      }) as any),
    ];

    const inventories: InventoryModel[] = await Promise.all(createInventoriesPromises);
    const createReservationPromises: Array<Promise<any>> = [];
    for (const inventory of inventories) {
      createReservationPromises.push(this.createReservation(inventory, 10));
    }

    const reservations: ReservationModel[] = await Promise.all(createReservationPromises);

    await this.orderModel.create(OrderFactory.create({
      _id: ORDER_ID,
      businessId: BUSINESS_ID,
      flow: FLOW_ID,
      reservations: reservations,
      status: OrderStatusEnum.TEMPORARY,
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

export = UpdateOrderTemporaryWithFlowAndReservationsFixture;
