import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BusinessSchemaName } from '@pe/business-kit';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { environment } from '../../environments';
import { OrderSchemaName } from '../../environments/mongoose-schema.names';
import { CartItemDto, FlowDto } from '../dto/api';
import { AdminOrderDto } from '../dto/order/admin-order.dto';
import { CheckoutFlowDto } from '../dto/checkout';
import { OrderQueryDto } from '../dto/order';
import { OrderStatusEnum } from '../enums';
import {
  CartUpdateChangeSetInterface,
  InventoryQuantityChangeInterface,
  UpdatedReservationInterface,
} from '../interfaces/cart-change-set';
import { InventoryModel, OrderModel, ReservationModel } from '../models';
import { EventProducer } from '../producer/event.producer';
import { InventoryService } from './inventory.service';
import { ReservationService } from './reservation.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(OrderSchemaName) private orderModel: Model<OrderModel>,
    @InjectModel(BusinessSchemaName) private businessModel: Model<BusinessModel>,
    private inventoryService: InventoryService,
    private reservationService: ReservationService,
    private eventProducer: EventProducer,
  ) { }

  public async getForAdmin(query: OrderQueryDto)
    : Promise<{ documents: OrderModel[]; page: number; total: number }> {

    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const sort: any = query.sort || { createdAt: 1 };
    const skip: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.businessIds) {
      conditions.businessId = Array.isArray(query.businessIds) ? { $in: query.businessIds } : query.businessIds;
    }

    const documents: OrderModel[] = await this.orderModel
      .find(conditions)
      .select(query.projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const total: number = await this.orderModel.count(conditions);

    return {
      documents,
      page,
      total,
    };
  }


  public async createForAdmin(adminOrderDto: AdminOrderDto): Promise<OrderModel> {
    const business: BusinessModel = await this.getBusinessById(adminOrderDto.businessId);

    return this.create(business, adminOrderDto, (error: Error) => {
      throw new ConflictException(error);
    });
  }

  public async updateForAdmin(order: OrderModel, adminOrderDto: AdminOrderDto): Promise<OrderModel> {
    const business: BusinessModel = await this.getBusinessById(adminOrderDto.businessId);
    await this.update(business, order, adminOrderDto, (error: Error) => {
      throw new ConflictException(error);
    });

    return this.orderModel.findById(order.id);
  }

  public async deleteForAdmin(order: OrderModel): Promise<OrderModel> {
    return this.orderModel.findByIdAndDelete(order.id);
  }

  public async create(
    business: BusinessModel,
    flowDto: FlowDto,
    error: (message: any) => void = (): void => { },
  ): Promise<OrderModel> {
    const order: OrderModel = await this.orderModel.create({
      businessId: business.id,
      flow: flowDto.id ? flowDto.id : null,
      status: OrderStatusEnum.TEMPORARY,
    } as OrderModel);

    if (!flowDto.cart) {
      return order;
    }

    const reservations: Array<{ item: CartItemDto; inventory: InventoryModel }> = [];
    let isSuccessful: boolean = true;
    const failedItems: CartItemDto[] = [];

    for (const item of flowDto.cart) {
      const inventory: InventoryModel = await this.inventoryService.findOneByApiItem(business, item);
      if (!inventory || !inventory.isTrackable) {
        continue;
      }

      if (await this.inventoryService.reserveByDto(business, inventory, item)) {
        reservations.push({ item, inventory });
      } else {
        failedItems.push(item);
        isSuccessful = false;
      }
    }

    if (!isSuccessful) {
      for (const reserved of reservations) {
        await this.inventoryService.releaseByDto(business, reserved.inventory, reserved.item);
      }
      const failedInventoriesString: string = failedItems.map((i: CartItemDto) => i.sku).join(', ');
      error({
        message: {
          error: `Failed while reservation attempt for following SKUs: ${failedInventoriesString}.`,
          failedItems,
        },
      });
    }

    for (const reserved of reservations) {
      const reservation: ReservationModel = await this.reservationService.create(
        business,
        reserved.inventory,
        reserved.item,
      );

      order.reservations.push(reservation);
    }
    order.markModified('reservations');
    await order.save();

    for (const reserved of reservations) {
      const inventory: InventoryModel = reserved.inventory;
      const item: InventoryQuantityChangeInterface = reserved.item;

      inventory.stock = inventory.stock - item.quantity;
      await this.eventProducer.sendStockSubtracted(
        business,
        inventory,
        reserved.item.quantity,
      );
    }
    await this.eventProducer.sendOrderCreated(
      business,
      order,
    );

    return this.orderModel.findOne({ _id: order.id }).populate('reservations');
  }

  public async update(
    business: BusinessModel,
    order: OrderModel,
    flowDto: FlowDto,
    error: (message: any) => void = (): void => { },
  ): Promise<OrderModel> {
    if (order.status !== OrderStatusEnum.TEMPORARY) {
      error({
        message: {
          error: `Order is not updatable in ${order.status} status.`,
        },
      });
    }

    if (flowDto.id && !order.flow) {
      order = await this.orderModel.findOneAndUpdate(
        {
          _id: order.id,
        },
        {
          flow: flowDto.id,
        },
        {
          new: true,
        },
      ).exec();
    }

    await order.populate('reservations').execPopulate();
    if (!flowDto.cart || !flowDto.cart.length) {
      return;
    }

    const cartChangeSets: CartUpdateChangeSetInterface[] =
      await this.prepareCartUpdateChangeSets(business, order.reservations, flowDto.cart);

    if (cartChangeSets.find((c: CartUpdateChangeSetInterface) => c.inventory === null)) {
      return;
    }

    const updatedReservations: UpdatedReservationInterface[] = [];

    await this.attemptToReserveMoreSkus(cartChangeSets, business, updatedReservations, error);
    await this.releaseSkusWithDecreasedQuantity(cartChangeSets, business, updatedReservations);
    await this.releasingSkusRemovedFromCart(cartChangeSets, business, updatedReservations);

    await this.orderUpdate(updatedReservations, business, order);

    return this.orderModel.findOne({ _id: order.id }).populate('reservations');
  }

  public async release(order: OrderModel): Promise<void> {
    if (!this.canBeReleased(order)) {
      return;
    }
    await order
      .populate('business')
      .populate('reservations')
      .execPopulate()
      ;

    for (const reservation of order.reservations) {
      await this.inventoryService.releaseReservation(reservation);
      await reservation.populate('inventory').execPopulate();

      const inventory: InventoryModel = await this.inventoryService.findOneById(reservation.inventory.id);
      await this.eventProducer.sendStockAdded(
        order.business,
        inventory,
        reservation.quantity,
      );
    }

    await this.orderModel.findOneAndUpdate(
      {
        _id: order.id,
      },
      {
        status: OrderStatusEnum.RELEASED,
      },
      {
        new: true,
      },
    ).exec();
  }

  public async autoRelease(order: OrderModel): Promise<void> {
    if (!this.canBeReleased(order)) {
      return;
    }
    await order
      .populate('business')
      .populate('reservations')
      .execPopulate()
      ;

    for (const reservation of order.reservations) {
      await this.inventoryService.releaseReservation(reservation);
      await reservation.populate('inventory').execPopulate();

      const inventory: InventoryModel = await this.inventoryService.findOneById(reservation.inventory.id);
      await this.eventProducer.sendStockAdded(
        order.business,
        inventory,
        reservation.quantity,
      );
    }

    await this.orderModel.findOneAndUpdate(
      {
        _id: order.id,
      },
      {
        status: OrderStatusEnum.AUTO_RELEASED,
      },
      {
        new: true,
      },
    ).exec();
  }

  public async toPermanent(order: OrderModel): Promise<OrderModel> {
    if (order.status === OrderStatusEnum.PERMANENT) {
      return;
    }

    return this.orderModel.findOneAndUpdate(
      {
        _id: order.id,
      },
      {
        status: OrderStatusEnum.PERMANENT,
      },
      {
        new: true,
      },
    );
  }

  public async setupPaymentFlow(order: OrderModel, flowId: string): Promise<OrderModel> {
    return this.orderModel.findOneAndUpdate(
      {
        _id: order.id,
      },
      {
        flow: flowId,
      },
      {
        new: true,
      },
    );
  }

  public async setupTransaction(order: OrderModel, transactionId: string): Promise<OrderModel> {
    return this.orderModel.findOneAndUpdate(
      {
        _id: order.id,
      },
      {
        transaction: transactionId,
      },
      {
        new: true,
      },
    );
  }

  public async close(order: OrderModel): Promise<OrderModel> {
    if (order.status === OrderStatusEnum.CLOSED) {
      return;
    }

    await order.populate('reservations').execPopulate();
    for (const reservation of order.reservations) {
      await reservation.populate('inventory').execPopulate();
      await this.inventoryService.closeReservation(reservation);
    }

    return this.orderModel.findOneAndUpdate(
      {
        _id: order.id,
      },
      {
        status: OrderStatusEnum.CLOSED,
      },
      {
        new: true,
      },
    );
  }

  public async processPaymentFlow(flow: CheckoutFlowDto): Promise<OrderModel> {
    if (!flow.cart || !flow.cart.order) {
      return;
    }

    const order: OrderModel = await this.findOneById(flow.cart.order);
    if (!order) {
      return;
    }

    if (order.flow) {
      return;
    }

    await this.setupPaymentFlow(order, flow.id);
  }

  public async findOneById(orderId: string): Promise<OrderModel> {
    return this.orderModel.findOne({ _id: orderId });
  }

  public async findOneByPaymentFlow(flowId: string): Promise<OrderModel> {
    return this.orderModel.findOne({ flow: flowId });
  }

  public async findOneByTransaction(transactionId: string): Promise<OrderModel> {
    return this.orderModel.findOne({ transaction: transactionId });
  }

  public async findOutdatedTemporary(expireReservationDate: Date): Promise<OrderModel[]> {
    return this.orderModel
      .find({
        createdAt: { $lte: expireReservationDate },
        status: OrderStatusEnum.TEMPORARY,
      })
      .populate('reservations')
      ;
  }

  public async findAllByBusiness(business: BusinessModel): Promise<OrderModel[]> {
    return this.orderModel.find({ businessId: business._id }).populate('reservations');
  }

  public async processOutdatedTemporary(): Promise<number> {
    const expireReservationDate: Date = new Date();
    expireReservationDate.setHours(new Date().getHours() - environment.reservationTTLHours);

    const orders: OrderModel[] = await this.findOutdatedTemporary(expireReservationDate);

    for (const order of orders) {
      await this.autoRelease(order);
    }

    return orders.length;
  }

  public async deleteAllByBusiness(business: BusinessModel): Promise<void> {
    await this.orderModel.deleteMany({ businessId: business.id }).exec();
  }

  private async prepareCartUpdateChangeSets(
    business: BusinessModel,
    reservations: ReservationModel[],
    cartItems: CartItemDto[],
  ): Promise<CartUpdateChangeSetInterface[]> {
    const result: CartUpdateChangeSetInterface[] = [];

    for (const cartItem of cartItems) {
      const inventory: InventoryModel = await this.inventoryService.findOneByApiItem(business, cartItem);
      if (!inventory) {
        continue;
      }

      const reservation: ReservationModel = reservations.find((r: ReservationModel) => r.inventory.id === inventory.id);

      result.push({
        inventory: inventory,
        item: cartItem,
        reservation: reservation,
      });
    }

    for (const reservation of reservations) {
      await reservation.populate('inventory').execPopulate();
      const inventory: InventoryModel = reservation.inventory;

      if (result.find((cs: CartUpdateChangeSetInterface) => cs.inventory.id === inventory.id)) {
        continue;
      }

      result.push({
        inventory: inventory,
        item: null,
        reservation: reservation,
      });
    }

    return result;
  }

  /**
   * Attempt to reserve more for SKUs with increased quantity or newly added
   */
  private async attemptToReserveMoreSkus(
    cartChangeSets: CartUpdateChangeSetInterface[],
    business: BusinessModel,
    updatedReservations: UpdatedReservationInterface[],
    error: (message: any) => void,
  ): Promise<any> {
    const { isSuccessful, failedItems }: { isSuccessful: boolean; failedItems: CartItemDto[] } =
      await this.attemptToReserveSkus(
        cartChangeSets,
        business,
        updatedReservations,
      );

    if (!isSuccessful) {
      for (const reserved of updatedReservations) {
        await this.inventoryService.releaseByDto(business, reserved.inventory, reserved.changeSet);
      }
      const failedInventoriesString: string = failedItems.map((i: CartItemDto) => i.sku).join(', ');
      error({
        message: {
          error: `Failed while reservation attempt for following SKUs: ${failedInventoriesString}.`,
          failedItems,
        },
      });
    }
  }

  private async attemptToReserveSkus(
    cartChangeSets: CartUpdateChangeSetInterface[],
    business: BusinessModel,
    updatedReservations: UpdatedReservationInterface[],
  ): Promise<{ isSuccessful: boolean; failedItems: CartItemDto[] }> {
    let isSuccessful: boolean = true;
    const failedItems: CartItemDto[] = [];

    for (const cartChangeSet of cartChangeSets) {
      const inventory: InventoryModel = cartChangeSet.inventory;
      const item: CartItemDto = cartChangeSet.item;
      const reservation: ReservationModel = cartChangeSet.reservation;

      if (!inventory.isTrackable) {
        continue;
      }

      let changeSet: InventoryQuantityChangeInterface;

      switch (true) {
        /**
         * Quantity increased
         */
        case item && reservation && item.quantity > reservation.quantity:
          changeSet = { quantity: item.quantity - reservation.quantity };
          if (await this.inventoryService.reserveByDto(business, inventory, changeSet)) {
            updatedReservations.push({ reservation, changeSet, inventory });
          } else {
            isSuccessful = false;
            failedItems.push(item);
          }
          break;
        /**
         * Newly added
         */
        case item && !reservation:
          changeSet = { quantity: item.quantity };
          if (await this.inventoryService.reserveByDto(business, inventory, changeSet)) {
            updatedReservations.push({ reservation, changeSet, inventory });
          } else {
            isSuccessful = false;
            failedItems.push(item);
          }
          break;
      }
    }

    return { isSuccessful, failedItems };
  }

  /**
   * Release SKUs with decreased quantity
   */
  private async releaseSkusWithDecreasedQuantity(
    cartChangeSets: CartUpdateChangeSetInterface[],
    business: BusinessModel,
    updatedReservations: UpdatedReservationInterface[],
  ): Promise<void> {
    for (const cartChangeSet of cartChangeSets) {
      const inventory: InventoryModel = cartChangeSet.inventory;
      const item: CartItemDto = cartChangeSet.item;
      const reservation: ReservationModel = cartChangeSet.reservation;

      if (!inventory.isTrackable) {
        continue;
      }

      if (item && reservation && item.quantity < reservation.quantity) {
        const changeSet: InventoryQuantityChangeInterface = { quantity: reservation.quantity - item.quantity };
        await this.inventoryService.releaseByDto(business, inventory, changeSet);

        updatedReservations.push({
          changeSet: {
            quantity: -changeSet.quantity,
          },
          inventory,
          reservation,
        });
      }
    }
  }

  /**
   * Release SKUs removed from cart (item is null)
   */
  private async releasingSkusRemovedFromCart(
    cartChangeSets: CartUpdateChangeSetInterface[],
    business: BusinessModel,
    updatedReservations: UpdatedReservationInterface[],
  ): Promise<void> {
    for (const cartChangeSet of cartChangeSets) {
      const inventory: InventoryModel = cartChangeSet.inventory;
      const item: CartItemDto = cartChangeSet.item;
      const reservation: ReservationModel = cartChangeSet.reservation;

      if (!inventory.isTrackable) {
        continue;
      }

      if (!item) {
        const changeSet: InventoryQuantityChangeInterface = { quantity: reservation.quantity };
        await this.inventoryService.releaseByDto(business, inventory, changeSet);

        updatedReservations.push({
          changeSet: {
            quantity: -changeSet.quantity,
          },
          inventory,
          reservation,
        });
      }
    }
  }

  private async orderUpdate(
    updatedReservations: UpdatedReservationInterface[],
    business: BusinessModel,
    order: OrderModel,
  ): Promise<void> {
    for (const reserved of updatedReservations) {
      const inventory: InventoryModel = reserved.inventory;
      const changeSet: InventoryQuantityChangeInterface = reserved.changeSet;
      const reservation: ReservationModel = reserved.reservation;

      inventory.stock = inventory.stock - changeSet.quantity;
      switch (true) {
        case !reservation:
          const created: ReservationModel = await this.reservationService.create(
            business,
            inventory,
            changeSet,
          );
          order.reservations.push(created);
          await this.eventProducer.sendStockSubtracted(
            business,
            inventory,
            changeSet.quantity,
          );
          break;
        case reservation.quantity + changeSet.quantity === 0:
          await this.reservationService.remove(reservation);
          order.reservations.pull(reservation);
          await this.eventProducer.sendStockAdded(
            business,
            inventory,
            -changeSet.quantity,
          );
          break;
        case changeSet.quantity > 0:
          await this.reservationService.updateQuantity(
            reservation,
            changeSet,
          );
          await this.eventProducer.sendStockSubtracted(
            business,
            inventory,
            changeSet.quantity,
          );
          break;
        case changeSet.quantity < 0:
          await this.reservationService.updateQuantity(
            reservation,
            changeSet,
          );
          await this.eventProducer.sendStockAdded(
            business,
            inventory,
            -changeSet.quantity,
          );
          break;
      }
    }
    order.markModified('reservations');
    await order.save();
  }

  private canBeReleased(order: OrderModel): boolean {
    return order.status === OrderStatusEnum.TEMPORARY
      || order.status === OrderStatusEnum.PERMANENT;
  }

  private async getBusinessById(businessId: string): Promise<BusinessModel> {
    const business: BusinessModel = await this.businessModel.findById(businessId);
    if (!business) {
      throw new NotFoundException(`business with id:'${businessId}' does not exist`);
    }

    return business;
  }
}
