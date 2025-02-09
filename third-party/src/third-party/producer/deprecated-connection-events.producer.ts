import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { ConsumerEventsEnum, IntegrationModel } from '@pe/third-party-sdk';
import { BusinessModel } from '../../business/models';

@Injectable()
export class DeprecatedConnectionEventsProducer {
  constructor(
    private readonly rabbitMqClient: RabbitMqClient,
  ) { }

  /**
   * @deprecated This event kept for compatibility with services still not migrated to Connections
   */
  public async sendDeprecatedConnectionStatusEvent(
    name: ConsumerEventsEnum.IntegrationConnected | ConsumerEventsEnum.IntegrationDisconnected,
    integration: IntegrationModel,
    business: BusinessModel,
  ): Promise<void> {
    await this.sendEvent(
      name,
      {
        business: {
          id: business.id,
        },
        integration: {
          category: integration.category,
          name: integration.name,
        },
        thirdParty: {
          category: integration.category,
          name: integration.name,
        },
      },
    );
  }

  private async sendEvent(
    eventName: ConsumerEventsEnum,
    payload: { },
  ): Promise<void> {
    return this.rabbitMqClient.send(
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
