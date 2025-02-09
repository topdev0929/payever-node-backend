import { Inject, Injectable, Logger } from '@nestjs/common';
import { MediaAdditionalImageTypesEnum } from '@pe/media-sdk';
import { ServiceTag } from '@pe/nest-kit/modules/collector-pattern';
import { extension } from 'mime-types';
import * as sharp from 'sharp';
import { ImagesStorage, MediaResizeResolver } from '../..';
import { BlobStorageService } from '../../../../storage/services';
import { readFileAsync } from '../../../../tools/fs-tools.helper';
import { ImageMimeTypes, MimeTypesEnum } from '../../../../tools/mime-types.enum';
import { ArgumentMediaContainerEnum } from '../../../enum';
import { ThumbnailGeneratorInterface, ThumbnailGeneratorResult } from '../interfaces';
import { FsFile, ImageTransformResult, MemFile } from '../../../interfaces';

@Injectable()
@ServiceTag('media-thumbnail-generator')
export class ImageThumbnailGenerator implements ThumbnailGeneratorInterface {
  @Inject() private readonly imagesStorage: ImagesStorage;

  constructor(
    private mediaSizeResolver: MediaResizeResolver,
    private storageService: BlobStorageService,
    private logger: Logger,
  ) {}

  public async generate(container: ArgumentMediaContainerEnum, file: FsFile): Promise<ThumbnailGeneratorResult> {
    try {
      const fileBuffer: Buffer = await readFileAsync(file.localPath);

      const thumbnailSize: ImageTransformResult = this.mediaSizeResolver.getTransformParametersFor(
        container,
        MediaAdditionalImageTypesEnum.Thumbnail,
      );
      const thumbnailBlobName: string = `${file.uniqfileName}-thumbnail`;
      const fileExt: string | any = extension(file.mimeType);

      const optimizedWallpaperSharp: sharp.Sharp = sharp(fileBuffer)
        .resize(1920, 1440, { fit: 'inside', withoutEnlargement: true })
        .toFormat(fileExt, this.imagesStorage.getImageOutputOptions(MimeTypesEnum.JPEG));

      const thumbnailBlobPromise: Promise<string> = optimizedWallpaperSharp
        .clone()
        .resize(thumbnailSize.width, thumbnailSize.height, thumbnailSize.options)
        .toBuffer()
        .then((imageBuffer: Buffer) => {
          return this.storageService.createBlobFromMemory(
            container,
            thumbnailBlobName,
            { mimetype: file.mimeType } as MemFile,
            imageBuffer,
          );
        });

      const thumbnailBlobNames: string[] = await Promise.all([thumbnailBlobPromise]);

      return { blobName: thumbnailBlobNames[0] };
    } catch (error) {
      const errorMessage = `Error occured while getting file: ${file.localPath}`;
      this.logger.error({
        error: error.message,
        message: errorMessage,
      });
      throw new Error(errorMessage);
    }
  }

  public doesSupport(mimeType: MimeTypesEnum): boolean {
    return ImageMimeTypes.indexOf(mimeType) !== -1;
  }
}
