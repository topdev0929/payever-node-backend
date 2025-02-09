import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { MessageBusChannelsEnum, UserRabbitMessagesEnum } from '../enums';
import { CurrentWallpaperBusDto } from '../dto';
import { BusinessService } from '../services';

@Controller()
export class WallpaperConsumer {
  constructor(
    private readonly businessService: BusinessService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: UserRabbitMessagesEnum.BusinessCurrentWallpaperExported,
  })
  public async onBusinessCurrentWallpaperExported(data: CurrentWallpaperBusDto): Promise<void> {
    await this.businessService.updateCurrentWallpaper(data);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: UserRabbitMessagesEnum.BusinessCurrentWallpaperUpdated,
  })
  public async onBusinessCurrentWallpaperUpdated(data: CurrentWallpaperBusDto): Promise<void> {
    await this.businessService.updateCurrentWallpaper(data);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: UserRabbitMessagesEnum.RpcBusinessCurrentWallpaperUpdated,
  })
  public async onRpcBusinessCurrentWallpaperUpdated(data: CurrentWallpaperBusDto): Promise<void> {
    await this.businessService.updateCurrentWallpaper(data);
  }
}
