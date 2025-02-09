import { Injectable } from '@nestjs/common';

import { RabbitMqClient } from '@pe/nest-kit';
import { BusinessModelLocal } from '../../business';
import { MessageBusEventsEnum } from '../enum';
import { IntegrationModel, IntegrationSubscriptionModel } from '../models';
import { ReportDataRequestTaskInterface } from '../interfaces';

@Injectable()
export class EventProducer {
  constructor(
    private readonly rabbitMqClient: RabbitMqClient,
  ) { }

  public async exportSubscriptionsToProduct(
    subscription: IntegrationSubscriptionModel,
    business: BusinessModelLocal,
  ): Promise<void> {
    const payload: any = {
      businessId: business._id,
      category: subscription.integration.category,
      id: subscription.id,
      installed: subscription.installed,
      issuer: subscription.integration.issuer,
      name: subscription.integration.name,
    };

    return this.rabbitMqClient.send(
      {
        channel: MessageBusEventsEnum.ThirdPartyExported,
        exchange: 'async_events',
      },
      {
        name: MessageBusEventsEnum.ThirdPartyExported,
        payload,
      },
    );
  }

  public async syncIntegrations(
    businessIds: string[],
  ): Promise<void> {
    return this.rabbitMqClient.send(
      {
        channel: MessageBusEventsEnum.ConnectIntegrationSync,
        exchange: 'async_events',
      },
      {
        name: MessageBusEventsEnum.ConnectIntegrationSync,
        payload: businessIds,
      },
    );
  }

  public async sendThirdPartyEnabledDisabledMessage(
    business: BusinessModelLocal,
    integration: IntegrationModel,
    messageName: string,
  ): Promise<void> {
    await this.rabbitMqClient.send(
      {
        channel: messageName,
        exchange: 'async_events',
      },
      {
        name: messageName,
        payload: {
          businessId: business.id,
          category: integration.category,
          issuer: integration.issuer,
          name: integration.name,
          scopes: integration.scopes,
        },
      },
    );
  }

  public async sendReportDataPreparedMessage(reportDataRequestTask: ReportDataRequestTaskInterface[]): Promise<void> {
    await this.rabbitMqClient.send(
      {
        channel: 'connect.event.report-data.prepared',
        exchange: 'async_events',
      },
      {
        name: 'connect.event.report-data.prepared',
        payload: reportDataRequestTask,
      },
    );
  }
}
