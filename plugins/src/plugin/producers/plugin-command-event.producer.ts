import { Injectable } from '@nestjs/common';

import { RabbitMqClient } from '@pe/nest-kit';
import { PluginCommandModel } from '../models';
import { PluginRabbitMessagesEnum } from '../../environments';

@Injectable()
export class PluginCommandEventsProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async producePluginCommandExportEvent(plugin: PluginCommandModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: PluginRabbitMessagesEnum.PluginCommandExport,
        exchange: 'async_events',
      },
      {
        name: PluginRabbitMessagesEnum.PluginCommandExport,
        payload: {
          ...plugin,
        },
      },
    );
  }
}
