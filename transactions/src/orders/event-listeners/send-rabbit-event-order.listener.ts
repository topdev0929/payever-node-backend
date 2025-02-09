import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { OrderModel } from '../models';
import { OrderEventEnum } from '../enum';
import { OrdersEventProducer } from '../producer';
import { RabbitRoutingKeys } from '../../enums';

@Injectable()
export class SendRabbitEventOrderListener {
  constructor(
    private readonly ordersEventProducer: OrdersEventProducer,
  ) { }

  @EventListener(OrderEventEnum.OrderCreated)
  public async handleOrderCreated(
    order: OrderModel,
  ): Promise<void> {
    await this.ordersEventProducer.sendOrderEvent(
      RabbitRoutingKeys.OrderCreated,
      order,
    );
  }
}
