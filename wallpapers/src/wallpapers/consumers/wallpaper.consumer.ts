import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { WallpaperInterface } from '../interfaces';
import { BusinessWallpapersService } from '../services';
import { RabbitChannelsEnum } from '../enum';

@Controller()
export class WallpaperConsumer {
  constructor(
    private readonly wallpapersService: BusinessWallpapersService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Wallpapers,
    name: 'onboarding.event.setup.wallpaper',
  })
  public async setupWallpaper(dto: { data: WallpaperInterface; businessId: string }): Promise<void> {
    await this.wallpapersService.addWallpaper(
      dto.businessId,
      dto.data,
    );
  }
}
