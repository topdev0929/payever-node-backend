import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CheckoutPaymentMessageDto } from '../dto';
import { CheckoutFlowMessageDto } from '../dto/checkout';
import { CheckoutPaymentStatusEnum } from '../enums';
import { OrderModel } from '../models';
import { InventoryService, OrderService } from '../services';

@Controller()
export class TransactionsBusMessageConsumer {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly orderService: OrderService,
  ) { }

  @MessagePattern({
    name: 'checkout.event.payment-flow.created',
  })
  public async onCheckoutPaymentFlowCreated(data: CheckoutFlowMessageDto): Promise<void> {
    await this.processCheckoutPaymentFlow(data);
  }

  @MessagePattern({
    name: 'checkout.event.payment-flow.updated',
  })
  public async onCheckoutPaymentFlowUpdated(data: CheckoutFlowMessageDto): Promise<void> {
    await this.processCheckoutPaymentFlow(data);
  }

  @MessagePattern({
    name: 'checkout.event.payment.created',
  })
  public async onCheckoutPaymentCreated(data: CheckoutPaymentMessageDto): Promise<void> {
    if (!data.payment || !data.payment.payment_flow) {
      return;
    }

    const order: OrderModel = await this.orderService.findOneByPaymentFlow(data.payment.payment_flow.id);
    if (!order) {
      return;
    }

    await this.orderService.setupTransaction(order, data.payment.uuid);
  }

  @MessagePattern({
    name: 'checkout.event.payment.updated',
  })
  public async onCheckout(data: CheckoutPaymentMessageDto): Promise<void> {
    if (!data.payment || !data.payment.payment_flow) {
      return;
    }

    let order: OrderModel = await this.orderService.findOneByTransaction(data.payment.uuid);
    if (!order) {
      order = await this.orderService.findOneByPaymentFlow(data.payment.payment_flow.id);
      if (!order) {
        return;
      }

      await this.orderService.setupTransaction(order, data.payment.uuid);
    }

    switch (data.payment.status) {
      case CheckoutPaymentStatusEnum.STATUS_ACCEPTED:
        await this.orderService.close(order);
        break;
      case CheckoutPaymentStatusEnum.STATUS_DECLINED:
      case CheckoutPaymentStatusEnum.STATUS_FAILED:
      case CheckoutPaymentStatusEnum.STATUS_CANCELLED:
        await this.orderService.release(order);
        break;
    }
  }

  private async processCheckoutPaymentFlow(data: CheckoutFlowMessageDto): Promise<void> {
    if (!data.flow) {
      return;
    }

    await this.orderService.processPaymentFlow(data.flow);
  }
}
