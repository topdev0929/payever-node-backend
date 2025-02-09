import { Injectable } from '@nestjs/common';
import { EventDispatcher, EventListener } from '@pe/nest-kit/modules/event-dispatcher';
import { IntegrationEventsEnum } from '../enum';
import { IntegrationModel } from '../models';
import { IntegrationEventProducer } from '../producer';

@Injectable()
export class IntegrationListener {

  constructor(
    private readonly integrationEventProducer: IntegrationEventProducer,
  ) { }

  @EventListener(IntegrationEventsEnum.IntegrationCreated)
  public async handleIntegrationCreated(integration: IntegrationModel): Promise<void> {
    await this.integrationEventProducer.onCreate(integration);
  }

  @EventListener(IntegrationEventsEnum.IntegrationUpdated)
  public async handleIntegrationUpdated(integration: IntegrationModel): Promise<void> {
    await this.integrationEventProducer.onUpdate(integration);
  }
}
