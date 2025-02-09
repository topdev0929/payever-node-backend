import { Injectable } from '@nestjs/common';

import { RabbitMqClient } from '@pe/nest-kit';
import { RabbitMessagesEnum } from '../../common';

@Injectable()
export class OrganizationEventProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async send(event: RabbitMessagesEnum, payload: any): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: event,
        exchange: 'async_events',
      },
      {
        name: event,
        payload,
      },
      true,
    );
  }
}
