import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { MessageBusEventsEnum } from '../enum';
import { IntegrationSubscriptionModel } from '../models';

@Injectable()
export class IntegrationSubscriptionEventProducer {
  constructor(
    private readonly rabbitMqClient: RabbitMqClient,
  ) { }

  public async onCreate(
    businessId: string,
    integrationSubscription: IntegrationSubscriptionModel,
  ): Promise<void> {
    const payload: any = {
      business: businessId,
      businessId: businessId,
      integrationSubscription,
    };

    return this.rabbitMqClient.send(
      {
        channel: MessageBusEventsEnum.ConnectIntegrationSubscriptionCreated,
        exchange: 'async_events',
      },
      {
        name: MessageBusEventsEnum.ConnectIntegrationSubscriptionCreated,
        payload,
      },
    );
  }

  public async onUpdate(
    businessId: string,
    integrationSubscription: IntegrationSubscriptionModel,
  ): Promise<void> {
    const payload: any = {
      business: businessId,
      businessId: businessId,
      integrationSubscription,
    };

    return this.rabbitMqClient.send(
      {
        channel: MessageBusEventsEnum.ConnectIntegrationSubscriptionUpdated,
        exchange: 'async_events',
      },
      {
        name: MessageBusEventsEnum.ConnectIntegrationSubscriptionUpdated,
        payload,
      },
    );
  }

  public async onDelete(
    integrationSubscriptionId: string,
  ): Promise<void> {
    const payload: any = {
      integrationSubscription: integrationSubscriptionId,
    };

    return this.rabbitMqClient.send(
      {
        channel: MessageBusEventsEnum.ConnectIntegrationSubscriptionDeleted,
        exchange: 'async_events',
      },
      {
        name: MessageBusEventsEnum.ConnectIntegrationSubscriptionDeleted,
        payload,
      },
    );
  }

  public async onExport(
    businessId: string,
    integrationSubscription: IntegrationSubscriptionModel,
  ): Promise<void> {
    const payload: any = {
      business: businessId,
      businessId: businessId,
      integrationSubscription,
    };

    return this.rabbitMqClient.send(
      {
        channel: MessageBusEventsEnum.ConnectIntegrationSubscriptionExported,
        exchange: 'async_events',
      },
      {
        name: MessageBusEventsEnum.ConnectIntegrationSubscriptionExported,
        payload,
      },
    );
  }
}
