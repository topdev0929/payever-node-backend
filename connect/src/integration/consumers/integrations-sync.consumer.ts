import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { RabbitChannelEnum } from '../../environments';
import { EventDispatcher } from '@pe/nest-kit';
import { IntegrationEventsEnum, MessageBusEventsEnum } from '../enum';

@Controller()
export class IntegrationSyncConsumer {
  constructor(
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  @MessagePattern({
    channel: RabbitChannelEnum.connect,
    name: MessageBusEventsEnum.ConnectIntegrationSync,
  })
  public async syncBusinesses(businessIds: string[]): Promise<void> {
    for (const businessId of businessIds) {
      await this.eventDispatcher.dispatch(
        IntegrationEventsEnum.IntegrationSync,
        businessId,
      );
    }
  }

}
