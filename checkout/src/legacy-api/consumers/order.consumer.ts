import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitBinding, MessageBusChannelsEnum } from '../../environments';
import { OrderIncomingDto } from '../dto';
import { OrderService } from '../services/order.service';

@Controller()
export class OrderConsumer {
  constructor(
    private readonly orderService: OrderService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.checkout,
    name: RabbitBinding.TransactionsOrderCreated,
  })
  public async onOrderCreatedEvent(order: OrderIncomingDto): Promise<void> {
    await this.orderService.createOrUpdateOrderFromEvent(order);
  }
}
