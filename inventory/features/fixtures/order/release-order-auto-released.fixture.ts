import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business/models';
import { InventoryModel, OrderModel, ReservationModel } from '../../../src/inventory/models';
import { InventoryFactory, OrderFactory, ReservationFactory } from '../factories';
import { OrderStatusEnum } from '../../../src/inventory/enums';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ORDER_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const FLOW_ID: string = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

class ReleaseOrderAutoReleasedFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly orderModel: Model<OrderModel> = this.application.get('OrderModel');
  private readonly inventoryModel: Model<InventoryModel> = this.application.get('InventoryModel');
  private readonly reservationModel: Model<ReservationModel> = this.application.get('ReservationModel');

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
    } as any);

    const createReservationPromises: Array<Promise<ReservationModel>> = [];
    for (let i: number = 1; i <= 2; i++) {
      createReservationPromises.push(
        this.createReservation(`sku_${i}`, 10, 10),
      );
    }

    const reservations: ReservationModel[] = await Promise.all(createReservationPromises);

    await this.orderModel.create(OrderFactory.create({
      _id: ORDER_ID,
      businessId: BUSINESS_ID,
      flow: FLOW_ID,
      reservations: reservations,
      status: OrderStatusEnum.AUTO_RELEASED,
    }) as any);
  }

  private async createReservation(
    sku: string,
    quantity: number,
    stock: number,
  ): Promise<ReservationModel> {

    const inventory: InventoryModel = await this.inventoryModel.create(InventoryFactory.create({
      businessId: BUSINESS_ID,
      isNegativeStockAllowed: false,
      isTrackable: true,
      reserved: quantity,
      sku,
      stock: stock,
    }) as any);

    return this.reservationModel.create(ReservationFactory.create({
      businessId: BUSINESS_ID,
      inventory,
      quantity,
    }) as any);
  }
}

export = ReleaseOrderAutoReleasedFixture;
