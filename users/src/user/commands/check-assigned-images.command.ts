import { Injectable, Logger } from '@nestjs/common';
import { Command, EventDispatcher } from '@pe/nest-kit';

import {
  MediaChangedDto, MediaContainersEnum, MediaEventsEnum,
} from '@pe/media-sdk';
import { BusinessModel, BusinessModelName, UserModel, UserModelName } from '../models';
import { BusinessService, UserService } from '../services';

@Injectable()
export class CheckAssignedImagesCommand {

  constructor(
    private readonly usersService: UserService,
    private readonly businessService: BusinessService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly logger: Logger,
  ) { }

  @Command({ command: 'media:check-assigned', describe: 'Sends media is assigned message' })
  public async checkAssignedMedia(): Promise<void> {
    const limit: number = 100;

    const processedUsersCount: number = await this.checkUsersAssignedMedia(limit);
    const processedBusinessCount: number = await this.checkBusinessAssignedMedia(limit);

    this.logger.log(processedUsersCount + ' users were processed');
    this.logger.log(processedBusinessCount + ' business were processed');
  }

  private async checkUsersAssignedMedia(limit: number): Promise<number> {
    let processedUsersCount: number = 0;
    let skip: number = 0;
    while (true) {
      const users: UserModel[] = await this.usersService.getList({ }, limit, skip);

      if (!users.length) {
        break;
      }

      processedUsersCount += users.length;

      for (const user of users) {
        await this.sendUserMediaAssignedMessage(user);
      }

      skip += limit;
    }

    return processedUsersCount;
  }

  private async checkBusinessAssignedMedia(limit: number): Promise<number> {
    let processedBusinessCount: number = 0;
    let skip: number = 0;
    while (true) {
      const businesses: BusinessModel[] = await this.businessService.getList({ }, limit, skip);
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

  private async sendUserMediaAssignedMessage(user: UserModel): Promise<void> {
    if (user.userAccount && user.userAccount.logo) {
      const list: string[] = [user.userAccount.logo];

      const mediaChangedDto: MediaChangedDto = {
        container: MediaContainersEnum.Images,
        originalMediaCollection: [],
        relatedEntity: {
          id: user.id,
          type: UserModelName,
        },
        updatedMediaCollection: list,
      };

      await this.eventDispatcher.dispatch(MediaEventsEnum.MediaChanged, mediaChangedDto);
    }
  }

  private async sendBusinessMediaAssignedMessage(business: BusinessModel): Promise<void> {
    let mediaChangedDto: MediaChangedDto;

    if (business.logo) {
      mediaChangedDto = {
        container: MediaContainersEnum.Images,
        originalMediaCollection: [],
        relatedEntity: {
          id: business.id,
          type: BusinessModelName,
        },
        updatedMediaCollection: [business.logo],
      };

      await this.eventDispatcher.dispatch(MediaEventsEnum.MediaChanged, mediaChangedDto);
    }

    if (business.documents && business.documents.commercialRegisterExcerptFilename) {
      mediaChangedDto = {
        container: MediaContainersEnum.Miscellaneous,
        originalMediaCollection: [],
        relatedEntity: {
          id: business.id,
          type: BusinessModelName,
        },
        updatedMediaCollection: [business.documents.commercialRegisterExcerptFilename],
      };

      await this.eventDispatcher.dispatch(MediaEventsEnum.MediaChanged, mediaChangedDto);
    }
  }
}
