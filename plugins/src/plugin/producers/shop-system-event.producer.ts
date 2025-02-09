import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { ShopSystemModel } from '../models';
import { PluginRabbitMessagesEnum } from '../../environments';

@Injectable()
export class ShopSystemEventsProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
  ) { }

  public async produceShopSystemExportEvent(shopSystem: ShopSystemModel): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: PluginRabbitMessagesEnum.ShopSystemExport,
        exchange: 'async_events',
      },
      {
        name: PluginRabbitMessagesEnum.ShopSystemExport,
        payload: {
          ...shopSystem,
        },
      },
    );
  }
}
