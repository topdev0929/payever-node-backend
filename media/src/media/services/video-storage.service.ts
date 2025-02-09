import * as sharp from 'sharp';
import { Injectable } from '@nestjs/common';
import { MediaAdditionalImageTypesEnum, MediaContainersEnum, MediaEventsPublisher } from '@pe/media-sdk';
import { BlobCreatedDto } from '../dto';
import { MimeTypesEnum } from '../../tools/mime-types.enum';
import { FsFile, ImageTransformResult } from '../interfaces';
import { BlobStorageService } from '../../storage/services/blob-storage.service';
import { MediaItemService } from './media-item.service';
import { VideoCompressionHelper } from '../../compressor';
import { getFileSize, getTmpFilePath, readFileAsync, withFolder } from '../../tools';
import { MediaCompressorWrapper } from '../../compressor/services';
import { ValidationFailedException } from '../exceptions';
import { BusinessMediaService } from './business-media.service';
import { ImageBrightnessResolver } from './image-brightness.resolver';
import { MediaResizeResolver } from './media-resize.resolver';
import { ArgumentMediaContainerEnum, CdnMediaContainerEnum, StorageContainerEnum } from '../enum';

type FileToBlobFactory = (file: FsFile) => Promise<BlobCreatedDto>;

export interface UploadScreenShotResult {
  screenShotName: string;
  brightnessGradation: string;
  thumbnailName: string;
}

@Injectable()
export class VideoStorageService {
  constructor(
    private readonly storageService: BlobStorageService,
    private readonly mediaItemService: MediaItemService,
    private readonly mediaEventsPublisher: MediaEventsPublisher,
    private readonly mediaCompressor: MediaCompressorWrapper,
    private readonly mediaSizeResolver: MediaResizeResolver,
  ) { }

  public storageFactory(
    dbService: BusinessMediaService,
    contextId: string,
    containerName: ArgumentMediaContainerEnum | CdnMediaContainerEnum,
  ): FileToBlobFactory {
    if (!this.isContainerAllowed(containerName)) {
      throw new ValidationFailedException(`Container "${containerName}" doesn't support video uploads`);
    }

    return async (file: FsFile): Promise<BlobCreatedDto> => {
      return withFolder(async (tmpFolder: string) => {
        const [storageContainerName, storageBlobName]: [StorageContainerEnum, string] =
          this.storageService.getContainerAndBlobNames(
            file.uniqfileName,
            containerName,
            false,
            true,
          );

        const {
          screenShotName,
          brightnessGradation,
          thumbnailName,
        }: UploadScreenShotResult = await this.uploadScreenShot(
          {
            ...file,
            uniqfileName: storageBlobName,
          },
          storageContainerName,
        );


        await this.storageService.createBlobFromFs(file, storageContainerName, storageBlobName),

        await this.mediaItemService.create(storageBlobName, storageContainerName);
        await this.mediaEventsPublisher.publishMediaCompressionRequested(
          storageBlobName,
          storageContainerName as MediaContainersEnum,
        );
        await dbService.create(contextId, storageContainerName, storageBlobName);

        return {
          blobName: storageBlobName,
          brightnessGradation,
          preview: screenShotName,
          thumbnail: thumbnailName,
        };
      });
    };
  }

  public async uploadScreenShot(
    file: FsFile,
    containerName: StorageContainerEnum,
  ): Promise<UploadScreenShotResult> {
    return withFolder(async (folder: string) => {
      const screenshotFilePath: string = `${getTmpFilePath(folder)}.png`;
      await VideoCompressionHelper.takeScreenshot(file.localPath, screenshotFilePath);

      const screenshotBuffer: Buffer = await readFileAsync(screenshotFilePath);
      const brightnessGradation: string = await ImageBrightnessResolver.getBrightnessGradation(screenshotBuffer);

      const compressedScreenshotFilePath: string = getTmpFilePath(folder);
      await this.mediaCompressor.compress(
        MimeTypesEnum.PNG,
        screenshotFilePath,
        compressedScreenshotFilePath,
      );

      const screenShotName: string = `${file.uniqfileName}_preview`;

      await this.storageService.createBlobFromFs(
        {
          fileSize: await getFileSize(screenshotFilePath),
          localPath: compressedScreenshotFilePath,
          mimeType: MimeTypesEnum.PNG,
        },
        containerName,
        screenShotName,
      );

      const thumbnailSize: ImageTransformResult = this.mediaSizeResolver.getTransformParametersFor(
        containerName as MediaContainersEnum,
        MediaAdditionalImageTypesEnum.Thumbnail,
      );

      const screenshotThumbnailFilePath: string = getTmpFilePath(folder);

      await sharp(screenshotFilePath)
        .resize(thumbnailSize.width, thumbnailSize.height, thumbnailSize.options)
        .toFile(screenshotThumbnailFilePath);

      const compressedThumbnailFilePath: string = getTmpFilePath(folder);

      await this.mediaCompressor.compress(
        MimeTypesEnum.PNG,
        screenshotThumbnailFilePath,
        compressedThumbnailFilePath,
      );

      const thumbnailFile: FsFile = {
        fileSize: await getFileSize(compressedThumbnailFilePath),
        localPath: compressedThumbnailFilePath,
        mimeType: MimeTypesEnum.PNG,
        originalFileName: file.originalFileName,
        uniqfileName: `${file.uniqfileName}-thumbnail`,
      };

      const thumbnailName: string = thumbnailFile.uniqfileName;
      await this.storageService.createBlobFromFs(
        thumbnailFile,
        containerName,
        thumbnailFile.uniqfileName,
      );

      return { screenShotName, brightnessGradation, thumbnailName};
    });
  }

  private isContainerAllowed(containerName: ArgumentMediaContainerEnum | CdnMediaContainerEnum): boolean {
    const allowedMedia: Array<ArgumentMediaContainerEnum | CdnMediaContainerEnum> = [
      MediaContainersEnum.BuilderVideo,
      MediaContainersEnum.Social,
      MediaContainersEnum.Message,
      CdnMediaContainerEnum.Cdn_social,
    ];

    return allowedMedia.includes(containerName);
  }
}
