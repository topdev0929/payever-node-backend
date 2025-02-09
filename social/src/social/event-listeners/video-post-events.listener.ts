import { Injectable } from '@nestjs/common';
import { EventDispatcher, EventListener } from '@pe/nest-kit';
import { ThirdPartyActionEnum, VideoPostEventsEnum } from '../enums';
import { PostsService } from '../services';
import { VideoPostDataInterface } from '../interfaces';
import { FoldersEventsEnum } from '@pe/folders-plugin';
import { MappingHelper } from '../helpers';
import { PostModel } from '../models';

@Injectable()
export class VideoPostEventsListener {

  constructor(
    private readonly postService: PostsService,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  @EventListener(VideoPostEventsEnum.VideoPostCreated)
  private async handleVideoPostCreated(
    data: VideoPostDataInterface,
    extraData: { parentFolderId: string },
  ): Promise<void> {
    const post: PostModel = data.post;
    await post.populate('channelSet').execPopulate();

    await this.eventDispatcher.dispatch(
      FoldersEventsEnum.FolderActionCreateDocument,
      await MappingHelper.map(
        { ...post.toObject(), parentFolderId: extraData?.parentFolderId } as any,
        { omitParentFolderId: false},
        false,
      ),
    );

    if (extraData?.parentFolderId) {
      await this.eventDispatcher.dispatch(
        FoldersEventsEnum.FolderActionMoveDocument,
        post._id,
        extraData?.parentFolderId,
      );
    }
    
    this.postService.uploadVideo(
      data.business,
      data.filePath,
      data.randomTempFolder,
      data.post,
    ).catch();
  }

  @EventListener(VideoPostEventsEnum.VideoPostUpdated)
  private async handleVideoPostUpdated(
    data: VideoPostDataInterface,
  ): Promise<void> {
    const post: PostModel = data.post;
    await post.populate('channelSet').execPopulate();

    await this.postService.callThirdpartyAppForVideo(
      data.business,
      data.filePath,
      data.randomTempFolder,
      data.post,
      ThirdPartyActionEnum.UpdatePost,
    ).catch();
  }
}
