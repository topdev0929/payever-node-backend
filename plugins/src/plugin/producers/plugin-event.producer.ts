import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { PluginModel } from '../models';
import { PluginRabbitMessagesEnum } from '../../environments';

@Injectable()
export class PluginEventsProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async producePluginExportEvent(plugin: PluginModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: PluginRabbitMessagesEnum.PluginExport,
        exchange: 'async_events',
      },
      {
        name: PluginRabbitMessagesEnum.PluginExport,
        payload: {
          ...plugin,
        },
      },
    );
  }
}
