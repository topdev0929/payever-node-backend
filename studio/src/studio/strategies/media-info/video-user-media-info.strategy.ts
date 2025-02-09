import { Injectable, Logger } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit/modules/collector-pattern';
import { MediaOwnerTypeEnum, MediaTypeEnum, ServiceTagEnum } from '../../enums';
import { MediaInfoTaskModel } from '../../models';
import { MediaInfoService, UserMediaService } from '../../services';
import { MediaInfoTaskStrategyInterface } from './interfaces';
import { MediaInfoInterface } from '../../interfaces';

@Injectable()
@ServiceTag(ServiceTagEnum.MEDIA_INFO_TASK)
export class VideoUserMediaInfoStrategy implements MediaInfoTaskStrategyInterface {
  public readonly mediaType: MediaTypeEnum = MediaTypeEnum.VIDEO;
  public readonly ownerType: MediaOwnerTypeEnum = MediaOwnerTypeEnum.USER;

  constructor(
    private readonly userMediaService: UserMediaService,
    private readonly mediaInfoService: MediaInfoService,
    private readonly logger: Logger,
  ) { }

  public async runTask(
    mediaInfoTasks: MediaInfoTaskModel[],
  ): Promise<void> {
    if (!mediaInfoTasks || mediaInfoTasks.length === 0) {
      return ;
    }
    this.logger.log('Processing Video User Media Info Task ...');

    const mediaInfos: MediaInfoInterface[] = await this.mediaInfoService.getVideoInfoFromTask(mediaInfoTasks);
    const promise: any[] = [];
    for (const mediaInfo of mediaInfos) {
      promise.push(this.userMediaService.updateMediaInfoById(mediaInfo.mediaId, mediaInfo));
    }
    await Promise.all(promise);
  }
}
