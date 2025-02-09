import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { plainToClass } from 'class-transformer';
import { RabbitRoutingKeys } from '../../enums';
import { OrderCreatedDto } from '../dto';
import { OrderModel } from '../models';

@Injectable()
export class OrdersEventProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async sendOrderEvent(
    name: RabbitRoutingKeys.OrderCreated,
    orderModel: OrderModel,
  ): Promise<void> {
    await this.sendEvent(
      name,
      {
        id: orderModel.id,
        ...plainToClass<OrderCreatedDto, OrderModel>(
          OrderCreatedDto,
          orderModel,
        ),
      },
    );
  }

  private async sendEvent(
    eventName: string,
    payload: { },
  ): Promise<void> {
    return this.rabbitClient.send(
      {
        channel: eventName,
        exchange: 'async_events',
      },
      {
        name: eventName,
        payload,
      },
    );
  }
}
