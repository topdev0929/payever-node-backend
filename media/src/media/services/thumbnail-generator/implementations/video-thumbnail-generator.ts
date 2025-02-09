import { Inject, Injectable } from '@nestjs/common';
import { ServiceTag } from '@pe/nest-kit/modules/collector-pattern';
import { UploadScreenShotResult, VideoStorageService } from '../..';
import { MimeTypesEnum, VideoMimeTypes } from '../../../../tools/mime-types.enum';
import { ArgumentMediaContainerEnum } from '../../../enum';
import { FsFile } from '../../../interfaces';
import { ThumbnailGeneratorInterface, ThumbnailGeneratorResult } from '../interfaces';

@Injectable()
@ServiceTag('media-thumbnail-generator')
export class VideoThumbnailGenerator implements ThumbnailGeneratorInterface {
  @Inject() private readonly videoStorage: VideoStorageService;

  public async generate(container: ArgumentMediaContainerEnum, file: FsFile): Promise<ThumbnailGeneratorResult> {
    const { thumbnailName }: UploadScreenShotResult = await this.videoStorage.uploadScreenShot(
      {
        ...file,
        uniqfileName: file.uniqfileName,
      },
      container,
    );
    
    return { blobName: thumbnailName };
  }

  public doesSupport(mimeType: MimeTypesEnum): boolean {
    return VideoMimeTypes.indexOf(mimeType) !== -1;
  }
}
