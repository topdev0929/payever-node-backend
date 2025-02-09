import { Injectable, Logger } from '@nestjs/common';

import { RabbitMqClient, RabbitMqRPCClient } from '@pe/nest-kit';
import { WallpaperInterface } from '../interfaces';
import { RabbitMessages } from '../enum/rabbit-messages.enum';

@Injectable()
export class BusinessWallpaperMessagesProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly rabbitMqRPCClient: RabbitMqRPCClient,
    private readonly logger: Logger,
  ) { }

  public async produceBusinessCurrentWallpaperUpdated(
    businessId: string,
    wallpaper: WallpaperInterface,
  ): Promise<void> {
      await this.produceBusinessWalpaperTemplate(RabbitMessages.BusinessWallpaperUpdated, businessId, wallpaper);
  }

  public async produceBusinessCurrentWallpaperExported(
    businessId: string,
    wallpaper: WallpaperInterface,
  ): Promise<void> {
      await this.produceBusinessWalpaperTemplate(RabbitMessages.BusinessWallpaperExported, businessId, wallpaper);
  }

  public async produceRpcBusinessCurrentWallpaperUpdated(
    businessId: string,
    wallpaper: WallpaperInterface,
  ): Promise<void> {
      await this.produceRpcBusinessWalpaperTemplate(RabbitMessages.RpcBusinessWallpaperUpdated, businessId, wallpaper);
  }

  private async produceBusinessWalpaperTemplate(
    message: RabbitMessages,
    businessId: string,
    wallpaper: WallpaperInterface,
  ): Promise<void> {
    if (!wallpaper) {
      return ;
    }

    await this.rabbitClient.send(
      {
        channel: message,
        exchange: 'async_events',
      },
      {
        name: message,
        payload: {
          businessId,
          currentWallpaper: wallpaper,
        },
      },
    );
  }

  private async produceRpcBusinessWalpaperTemplate(
    eventName: RabbitMessages,
    businessId: string,
    wallpaper: WallpaperInterface,
  ): Promise<void> {
    if (!wallpaper) {
      return ;
    }

    await this.rabbitMqRPCClient.send(
      {
        channel: eventName,
        exchange: 'async_events',
      },
      {
        name: eventName,
        payload: {
          businessId,
          currentWallpaper: wallpaper,
        },
      },
      {
        responseType: 'json',
      },
    ).catch((error: any) => {
      this.logger.error(
        {
          data: {
            businessId,
            currentWallpaper: wallpaper,
          },
          error: error.message,
          message: 'Failed wallpapers RPC call',
          routingKey: eventName,
        },
        error.stack,
        'BusinessWallpaperMessagesProducer',
      );
    });
  }
}
