import { Injectable } from '@nestjs/common';
import { EventDispatcher, EventListener } from '@pe/nest-kit';
import { UserWallpapersEmitterEventsEnum } from '../enum';
import { UserWallpapersModel, UserWallpapersModelName } from '../models';
import { MediaChangedDto, MediaContainersEnum, MediaEventsEnum } from '@pe/media-sdk';
import { WallpaperInterface } from '../interfaces';
import { FoldersEventsEnum } from '@pe/folders-plugin';

@Injectable()
export class UserWallpaperEventListner {
  constructor(
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  @EventListener(UserWallpapersEmitterEventsEnum.UserWallpapersCreated)
  public async handleUserWallpapersCreated(
    userWallpapersModel: UserWallpapersModel,
  ): Promise<void> {
    if (userWallpapersModel.myWallpapers && userWallpapersModel.myWallpapers.length > 0) {
      await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionCreateDocument, userWallpapersModel);
      await this.triggerMediaChangedEvent([], userWallpapersModel.myWallpapers, userWallpapersModel.id);
    }
  }

  @EventListener(UserWallpapersEmitterEventsEnum.UserWallpapersUpdated)
  public async handleUserWallpapersUpdated(
    originalUserWallpapersModel: UserWallpapersModel,
    updatedUserWallpapersModel: UserWallpapersModel,
  ): Promise<void> {
    const originalMedia: WallpaperInterface[] = originalUserWallpapersModel.myWallpapers || [];
    const updatedMedia: WallpaperInterface[] = updatedUserWallpapersModel.myWallpapers || [];

    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionUpdateDocument, updatedMedia);

    await this.triggerMediaChangedEvent(originalMedia, updatedMedia, updatedUserWallpapersModel.id);
  }

  @EventListener(UserWallpapersEmitterEventsEnum.UserWallpapersRemoved)
  public async handleUserWallpepersRemoved(
    userWallpapersModel: UserWallpapersModel,
  ): Promise<void> {
    if (userWallpapersModel.myWallpapers && userWallpapersModel.myWallpapers.length > 0) {
      await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionDeleteDocument, userWallpapersModel.id);
      await this.triggerMediaChangedEvent(userWallpapersModel.myWallpapers, [], userWallpapersModel.id);
    }
  }

  private async triggerMediaChangedEvent(
    originalMedia: WallpaperInterface[],
    newMedia: WallpaperInterface[],
    userWallpapersId: string,
  ): Promise<void> {
    const mediaChangedDto: MediaChangedDto = {
      container: MediaContainersEnum.Wallpapers,
      originalMediaCollection: originalMedia.map((media: WallpaperInterface) => media.wallpaper),
      relatedEntity: {
        id: userWallpapersId,
        type: UserWallpapersModelName,
      },
      updatedMediaCollection: newMedia.map((media: WallpaperInterface) => media.wallpaper),
    };

    await this.eventDispatcher.dispatch(MediaEventsEnum.MediaChanged, mediaChangedDto);
  }

}
