import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { RabbitMessagesEnum } from '../../common';

@Injectable()
export class OAuthRabbitEventsProducer {
  constructor(private readonly rabbitClient: RabbitMqClient) { }

  public async oauthClientRemoved(businessId: string, oauthClientId: string): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitMessagesEnum.OAuthClientRemoved,
        exchange: 'async_events',
      },
      {
        name: RabbitMessagesEnum.OAuthClientRemoved,
        payload: {
          business: {
            id: businessId,
          },
          id: oauthClientId,
        },
      },
      true,
    );
  }
}
