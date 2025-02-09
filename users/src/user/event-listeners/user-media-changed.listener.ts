import { Injectable } from '@nestjs/common';
import { MediaChangedDto, MediaContainersEnum, MediaEventsEnum } from '@pe/media-sdk';
import { UserModel, UserModelName } from '../models';
import { EventDispatcher, EventListener } from '@pe/nest-kit';
import { UserEventsEnum } from '../enums';

@Injectable()
export class UserMediaChangedListener {
  constructor(
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  @EventListener(UserEventsEnum.UserCreated)
  public async handleUserCreated(user: UserModel): Promise<void> {
    if (user.userAccount.logo) {
      await this.triggerMediaChangedEvent([], [user.userAccount.logo], user.id);
    }
  }

  @EventListener(UserEventsEnum.UserUpdated)
  public async handleUserUpdated(originalUser: UserModel, updatedUser: UserModel): Promise<void> {
    const originalMedia: string[] = [];
    if (originalUser.userAccount.logo) {
      originalMedia.push(originalUser.userAccount.logo);
    }

    const updatedMedia: string[] = [];
    if (updatedUser.userAccount.logo) {
      updatedMedia.push(updatedUser.userAccount.logo);
    }

    await this.triggerMediaChangedEvent(originalMedia, updatedMedia, updatedUser.id);
  }

  private async triggerMediaChangedEvent(originalMedia: string[], newMedia: string[], userId: string): Promise<void> {
    const mediaChangedDto: MediaChangedDto = {
      container: MediaContainersEnum.Images,
      originalMediaCollection: originalMedia,
      relatedEntity: {
        id: userId,
        type: UserModelName,
      },
      updatedMediaCollection: newMedia,
    };

    await this.eventDispatcher.dispatch(MediaEventsEnum.MediaChanged, mediaChangedDto);
  }
}
