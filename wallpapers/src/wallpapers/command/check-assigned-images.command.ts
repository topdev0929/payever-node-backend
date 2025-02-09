import { Injectable, Logger } from '@nestjs/common';
import {
  Command, EventDispatcher,
} from '@pe/nest-kit';

import {
  MediaChangedDto, MediaContainersEnum, MediaEventsEnum,
} from '@pe/media-sdk';
import {
  BusinessWallpapersModel,
  BusinessWallpapersModelName,
  UserWallpapersModel,
  UserWallpapersModelName,
} from '../models';
import { BusinessWallpapersService, UserWallpapersService } from '../services';
import { WallpaperInterface } from '../interfaces';

@Injectable()
export class CheckAssignedImagesCommand {

  constructor(
    private readonly businessWallpapersService: BusinessWallpapersService,
    private readonly userWallpapersService: UserWallpapersService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly logger: Logger,
  ) { }

  @Command({ command: 'media:check-assigned', describe: 'Sends media is assigned message' })
  public async checkAssignedMedia(): Promise<void> {
    const limit: number = 100;

    const processedUsersCount: number = await this.checkUsersAssignedWallpapers(limit);
    const processedBusinessCount: number = await this.checkBusinessAssignedWallpapers(limit);

    this.logger.log(processedUsersCount + ' user wallpapers were processed');
    this.logger.log(processedBusinessCount + ' business wallpapers were processed');
  }

  private async checkUsersAssignedWallpapers(limit: number): Promise<number> {
    let processedUsersCount: number = 0;
    let skip: number = 0;
    while (true) {
      const userWallpapersList: UserWallpapersModel[] = await this.userWallpapersService.getList({ }, limit, skip);

      if (!userWallpapersList.length) {
        break;
      }

      processedUsersCount += userWallpapersList.length;

      for (const userWallpapers of userWallpapersList) {
        await this.sendUserWallpapersMediaAssignedMessage(userWallpapers);
      }

      skip += limit;
    }

    return processedUsersCount;
  }

  private async checkBusinessAssignedWallpapers(limit: number): Promise<number> {
    let processedBusinessCount: number = 0;
    let skip: number = 0;
    while (true) {
      const businesses: BusinessWallpapersModel[]  = await this.businessWallpapersService.getList({ }, limit, skip);
      if (!businesses.length) {
        break;
      }
      processedBusinessCount += businesses.length;
      for (const business of businesses) {
        await this.sendBusinessMediaAssignedMessage(business);
      }

      skip += limit;
    }

    return processedBusinessCount;
  }

  private async sendUserWallpapersMediaAssignedMessage(userWallpapers: UserWallpapersModel): Promise<void> {
    if (userWallpapers.myWallpapers) {
      const mediaChangedDto: MediaChangedDto = {
        container: MediaContainersEnum.Wallpapers,
        originalMediaCollection: [],
        relatedEntity: {
          id: userWallpapers.id,
          type: UserWallpapersModelName,
        },
        updatedMediaCollection: userWallpapers.myWallpapers.map((x: WallpaperInterface) => x.wallpaper),
      };

      await this.eventDispatcher.dispatch(MediaEventsEnum.MediaChanged, mediaChangedDto);
    }
  }

  private async sendBusinessMediaAssignedMessage(businessWallpapers: BusinessWallpapersModel): Promise<void> {
    if (businessWallpapers.myWallpapers) {
      const mediaChangedDto: MediaChangedDto = {
        container: MediaContainersEnum.Wallpapers,
        originalMediaCollection: [],
        relatedEntity: {
          id: businessWallpapers.id,
          type: BusinessWallpapersModelName,
        },
        updatedMediaCollection: businessWallpapers.myWallpapers.map((x: WallpaperInterface) => x.wallpaper),
      };

      await this.eventDispatcher.dispatch(MediaEventsEnum.MediaChanged, mediaChangedDto);
    }
  }
}
