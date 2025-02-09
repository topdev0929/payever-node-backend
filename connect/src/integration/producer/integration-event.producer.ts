import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { MessageBusEventsEnum } from '../enum';
import { IntegrationModel } from '../models';

@Injectable()
export class IntegrationEventProducer {
  constructor(
    private readonly rabbitMqClient: RabbitMqClient,
  ) { }

  public async onCreate(
    integration: IntegrationModel,
  ): Promise<void> {
    const payload: any = integration;

    return this.rabbitMqClient.send(
      {
        channel: MessageBusEventsEnum.ConnectIntegrationCreated,
        exchange: 'async_events',
      },
      {
        name: MessageBusEventsEnum.ConnectIntegrationCreated,
        payload,
      },
    );
  }

  public async onUpdate(
    integration: IntegrationModel,
  ): Promise<void> {
    const payload: any = integration;

    return this.rabbitMqClient.send(
      {
        channel: MessageBusEventsEnum.ConnectIntegrationUpdated,
        exchange: 'async_events',
      },
      {
        name: MessageBusEventsEnum.ConnectIntegrationUpdated,
        payload,
      },
    );
  }

  public async onDelete(
    integrationId: string,
  ): Promise<void> {
    const payload: any = {
      integration: integrationId,
    };

    return this.rabbitMqClient.send(
      {
        channel: MessageBusEventsEnum.ConnectIntegrationDeleted,
        exchange: 'async_events',
      },
      {
        name: MessageBusEventsEnum.ConnectIntegrationDeleted,
        payload,
      },
    );
  }

  public async onExport(
    integration: IntegrationModel,
  ): Promise<void> {
    const payload: any = integration;

    return this.rabbitMqClient.send(
      {
        channel: MessageBusEventsEnum.ConnectIntegrationExported,
        exchange: 'async_events',
      },
      {
        name: MessageBusEventsEnum.ConnectIntegrationExported,
        payload,
      },
    );
  }
}
