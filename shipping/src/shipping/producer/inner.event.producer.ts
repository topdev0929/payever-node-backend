import { Injectable, Logger } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { BusinessModel } from '../../business/models';
import { IntegrationModel, IntegrationSubscriptionModel } from '../../integration';
import { ThirdPartyActionEnum } from '../enums/third-party-action.enum';
import { ShippingTaskModel } from '../models/shipping-task.model';

/**
 * This producer firing events about changes from Payever services to outer integrations.
 * Also it calls actions of outer integrations using ThirdParty service.
 */
@Injectable()
export class InnerEventProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly logger: Logger,
  ) { }

  public async callIntegrationAction(
    business: BusinessModel,
    integrationSubscription: IntegrationSubscriptionModel,
    task: ShippingTaskModel,
    action: ThirdPartyActionEnum,
    data: any = { },
  ): Promise<void> {
    await integrationSubscription
      .populate('business')
      .populate('integration')
      .execPopulate();
    const integration: IntegrationModel = integrationSubscription.integration;

    const payload: any = {
      business: {
        id: business.id,
      },
      integration: {
        name: integration.name,
      },
      synchronization: task
        ? { taskId: task.id }
        : undefined,

      action,
      data,
    };

    this.logger.log({
      context: 'InnerEventProducer',
      message: 'SENDING "shipping.event.action.call" event',
      payload,
    });

    await this.rabbitClient.send(
      {
        channel: 'shipping.event.action.call',
        exchange: 'async_events',
      },
      {
        name: 'shipping.event.action.call',
        payload,
      },
    );

    this.logger.log({
      context: 'InnerEventProducer',
      message: 'SENT "shipping.event.action.call" event',
      payload,
    });
  }

  public async triggerInwardProductsSynchronize(
    business: BusinessModel,
    integrationSubscription: IntegrationSubscriptionModel,
    task: ShippingTaskModel,
  ): Promise<void> {
    return this.callIntegrationAction(
      business,
      integrationSubscription,
      task,
      ThirdPartyActionEnum.SyncShippingData,
    );
  }
}
