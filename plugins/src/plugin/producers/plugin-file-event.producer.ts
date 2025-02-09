import { Injectable } from '@nestjs/common';

import { RabbitMqClient } from '@pe/nest-kit';
import { PluginFileModel } from '../models';
import { PluginRabbitMessagesEnum } from '../../environments';

@Injectable()
export class PluginFileEventsProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async producePluginFileExportEvent(plugin: PluginFileModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: PluginRabbitMessagesEnum.PluginFileExport,
        exchange: 'async_events',
      },
      {
        name: PluginRabbitMessagesEnum.PluginFileExport,
        payload: {
          ...plugin,
        },
      },
    );
  }
}
