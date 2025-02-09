import { Injectable } from '@nestjs/common';
import { EventListener, EventDispatcher } from '@pe/nest-kit';
import { BusinessWallpaperEmitterEvents } from '../enum';
import { BusinessWallpapersModel, BusinessWallpapersModelName } from '../models';
import { MediaChangedDto, MediaContainersEnum, MediaEventsEnum } from '@pe/media-sdk';
import { WallpaperInterface } from '../interfaces';

@Injectable()
export class BusinessWallpaperEventListner {
  constructor(
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  @EventListener(BusinessWallpaperEmitterEvents.BusinessWallpaperCreated)
  public async handleBusinessWallpaperCreatedEvent(
    businessWallpapers: BusinessWallpapersModel,
  ): Promise<void> {
    if (businessWallpapers.myWallpapers && businessWallpapers.myWallpapers.length > 0) {
      await this.triggerMediaChangedEvent([], businessWallpapers.myWallpapers, businessWallpapers.id);
    }
  }

  @EventListener(BusinessWallpaperEmitterEvents.BusinessWallpaperUpdated)
  public async handleBusinessWallpaperUpdatedEvent(
    originalBusinessWallpapers: BusinessWallpapersModel,
    updatedBusinessWallpapers: BusinessWallpapersModel,
  ): Promise<void> {
    const originalBusinessMedia: WallpaperInterface[] = originalBusinessWallpapers.myWallpapers || [];
    const updatedBusinessMedia: WallpaperInterface[] = updatedBusinessWallpapers.myWallpapers || [];

    await this.triggerMediaChangedEvent(originalBusinessMedia, updatedBusinessMedia, updatedBusinessWallpapers.id);
  }

  @EventListener(BusinessWallpaperEmitterEvents.BusinessWallpaperRemoved)
  public async handleBusinessWallpaperRemovedEvent(
    businessWallpapers: BusinessWallpapersModel,
  ): Promise<void> {
    if (businessWallpapers.myWallpapers && businessWallpapers.myWallpapers.length > 0) {
      await this.triggerMediaChangedEvent(businessWallpapers.myWallpapers, [], businessWallpapers.id);
    }
  }

  private async triggerMediaChangedEvent(
    originalMedia: WallpaperInterface[],
    newMedia: WallpaperInterface[],
    businessWallpapersId: string,
  ): Promise<void> {
    const mediaChangedDto: MediaChangedDto = {
      container: MediaContainersEnum.Wallpapers,
      originalMediaCollection: originalMedia.map((x: WallpaperInterface) => x.wallpaper),
      relatedEntity: {
        id: businessWallpapersId,
        type: BusinessWallpapersModelName,
      },
      updatedMediaCollection: newMedia.map((x: WallpaperInterface) => x.wallpaper),
    };

    await this.eventDispatcher.dispatch(MediaEventsEnum.MediaChanged, mediaChangedDto);
  }

}
