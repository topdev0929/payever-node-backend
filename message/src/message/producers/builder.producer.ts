import { Injectable, Inject } from '@nestjs/common';

import { RabbitMqClient } from '@pe/nest-kit';
import { BusinessModel } from '@pe/business-kit';

@Injectable()
export class BuilderProducer {
  @Inject() private readonly rabbitMqClient: RabbitMqClient;

  public async appCreated(
    business: BusinessModel,
  ): Promise<void> {
    await this.send(business, 'message.event.message.created');
  }
  
  public async appRemoved(
    business: BusinessModel,
  ): Promise<void> {
    await this.send(business, 'message.event.message.removed');
  }

  public async appExported(
    business: BusinessModel,
  ): Promise<void> {
    await this.send(business, 'message.event.message.export');
  }

  private async send(business: BusinessModel, eventName: string): Promise<void> {
    await this.rabbitMqClient.send(
      {
        channel: eventName,
        exchange: 'async_events',
      },
      {
        name: eventName,
        payload: {
          id: business._id,

          business: {
            id: business._id,
          },
          name: business.name,
          type: 'message',
        },
      },
    );
  }
}
