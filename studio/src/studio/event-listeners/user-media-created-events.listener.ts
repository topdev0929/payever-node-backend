import { Injectable } from '@nestjs/common';
import { FoldersEventsEnum } from '@pe/folders-plugin';
import { EventDispatcher, EventListener } from '@pe/nest-kit';
import { UserMediaEventsEnum } from '../enums';
import { UserMediaModel } from '../models';
import { BusinessMediaMessagesProducer } from '../producers';
import { UserMediaService } from '../services';

@Injectable()
export class UserMediaCreatedEventsListener {
  constructor(
    private readonly userMediaService: UserMediaService,
    private readonly businessMediaMessagesProducer: BusinessMediaMessagesProducer,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  @EventListener(UserMediaEventsEnum.UserMediaCreated)
  public async onUserMediaCreated(userMedia: UserMediaModel): Promise<void> {
    await this.userMediaService.removeAllSampleByBusinessId(userMedia.businessId);
    await this.businessMediaMessagesProducer.sendMediaCreatedMessage(userMedia);
    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionCreateDocument, userMedia);
  }

  @EventListener(UserMediaEventsEnum.UserMediaDeleted)
  public async onUserMediaDeleted(userMedia: UserMediaModel): Promise<void> {
    await this.businessMediaMessagesProducer.sendMediaDeletedMessage(userMedia);
    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionDeleteDocument, userMedia);
  }

  @EventListener(UserMediaEventsEnum.UserMediaUpdated)
  public async onUserMediaUpdated(userMedia: UserMediaModel): Promise<void> {
    await this.businessMediaMessagesProducer.sendMediaUpdatedMessage(userMedia);
    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionUpdateDocument, userMedia);
  }
}
