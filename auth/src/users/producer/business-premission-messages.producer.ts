import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { RabbitMessagesEnum } from '../../common';

@Injectable()
export class BusinessPermissionEventProducer {
  constructor(private readonly rabbitClient: RabbitMqClient) { }

  public async produceBusinessPermissionAddedEvent(userId: string, businessId: string): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitMessagesEnum.BusinessPermissionAdded,
        exchange: 'async_events',
      },
      {
        name: RabbitMessagesEnum.BusinessPermissionAdded,
        payload: {
          businessId,
          userId,
        },
      },
      true,
    );
  }

  public async produceBusinessPermissionDeletedEvent(userId: string, businessId: string): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitMessagesEnum.BusinessPermissionDeleted,
        exchange: 'async_events',
      },
      {
        name: RabbitMessagesEnum.BusinessPermissionDeleted,
        payload: {
          businessId,
          userId,
        },
      },
      true,
    );
  }
}
