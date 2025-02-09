import { Injectable, Logger } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit/modules/collector-pattern';
import { MediaOwnerTypeEnum, MediaTypeEnum, ServiceTagEnum } from '../../enums';
import { MediaInfoTaskModel } from '../../models';
import { MediaInfoService, SubscriptionMediaService } from '../../services';
import { MediaInfoTaskStrategyInterface } from './interfaces';
import { MediaInfoInterface } from '../../interfaces';

@Injectable()
@ServiceTag(ServiceTagEnum.MEDIA_INFO_TASK)
export class ImageSubscriptionMediaInfoStrategy implements MediaInfoTaskStrategyInterface {
  public readonly mediaType: MediaTypeEnum = MediaTypeEnum.IMAGE;
  public readonly ownerType: MediaOwnerTypeEnum = MediaOwnerTypeEnum.SUBSCRIPTION;

  constructor(
    private readonly subscriptionMediaService: SubscriptionMediaService,
    private readonly mediaInfoService: MediaInfoService,
    private readonly logger: Logger,
  ) { }

  public async runTask(
    mediaInfoTasks: MediaInfoTaskModel[],
  ): Promise<void> {
    if (!mediaInfoTasks || mediaInfoTasks.length === 0) {
      return ;
    }
    this.logger.log('Processing Image Subscription Media Info Task ...');

    const mediaInfos: MediaInfoInterface[] = await this.mediaInfoService.getImageInfoFromTask(mediaInfoTasks);
    const promise: any[] = [];
    for (const mediaInfo of mediaInfos) {
      promise.push(this.subscriptionMediaService.updateById(mediaInfo.mediaId, { mediaInfo: mediaInfo }));
    }
    await Promise.all(promise);
  }
}
