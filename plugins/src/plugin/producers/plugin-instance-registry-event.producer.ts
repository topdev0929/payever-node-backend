import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { PluginInstanceRegistryModel } from '../models';
import { PluginRabbitMessagesEnum } from '../../environments';

@Injectable()
export class PluginInstanceRegistryEventsProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async producePluginInstanceRegistryExportEvent(plugin: PluginInstanceRegistryModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: PluginRabbitMessagesEnum.PluginInstanceRegistryExport,
        exchange: 'async_events',
      },
      {
        name: PluginRabbitMessagesEnum.PluginInstanceRegistryExport,
        payload: {
          ...plugin,
        },
      },
    );
  }
}
