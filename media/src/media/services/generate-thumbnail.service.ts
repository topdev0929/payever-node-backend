import { HttpService, Inject, Injectable, Logger } from '@nestjs/common';
import { MediaAdditionalImageTypesEnum } from '@pe/media-sdk';
import { AxiosResponse } from 'axios';
import { extension } from 'mime-types';
import * as sharp from 'sharp';
import { environment } from '../../environments';
import { BlobStorageService } from '../../storage/services';
import { MimeTypesEnum } from '../../tools/mime-types.enum';
import { ArgumentMediaContainerEnum } from '../enum';
import { FsFile, ImageTransformResult } from '../interfaces';
import { MediaItemModel, MediaModel } from '../models';
import { BusinessMediaService, MediaItemService, MediaResizeResolver } from '../services';
import { ImagesStorage } from './images-storage.service';
import { MediaThumbnailGeneratorWrapper } from './thumbnail-generator';
import { ThumbnailGeneratorResult } from './thumbnail-generator/interfaces';

@Injectable()
export class GenerateThumbnailService {
  @Inject() private readonly imagesStorage: ImagesStorage;

  constructor(
    private readonly storageService: BlobStorageService,
    private readonly businessMediaService: BusinessMediaService,
    private readonly mediaSizeResolver: MediaResizeResolver,
    private readonly mediaItemService: MediaItemService,
    private readonly httpService: HttpService,
    private readonly thumbnailGeneratorWrapper: MediaThumbnailGeneratorWrapper,
    private readonly logger: Logger,
  ) {}

  public async generateFromBlob(
    localBlobRecord: MediaModel | MediaItemModel,
    container: ArgumentMediaContainerEnum,
    businessId: string,
  ): Promise<string> {
    const blobName = await this.generateForImages(localBlobRecord, container);
    await this.businessMediaService.create(businessId, container, blobName);
    await this.mediaItemService.create(blobName, container);

    return blobName;
  }

  public async generateFromFile(
    container: ArgumentMediaContainerEnum,
    businessId: string,
    file: FsFile,
  ): Promise<string> {
    const { blobName }: ThumbnailGeneratorResult = await this.thumbnailGeneratorWrapper.generate(container, file);
    await this.businessMediaService.create(businessId, container, blobName);
    await this.mediaItemService.create(blobName, container);

    return blobName;
  }

  private async generateForImages(
    localBlobRecord: MediaModel | MediaItemModel,
    container: ArgumentMediaContainerEnum,
  ): Promise<string> {
    try {
      const imageUrl: string = `${environment.storage_url}/${container}/${localBlobRecord.name}`;
      const res: AxiosResponse<any> = await this.httpService.get(imageUrl, { responseType: 'arraybuffer' }).toPromise();

      const thumbnailSize: ImageTransformResult = this.mediaSizeResolver.getTransformParametersFor(
        container,
        MediaAdditionalImageTypesEnum.Thumbnail,
      );
      const thumbnailBlobName: string = `${localBlobRecord.name}-thumbnail`;
      const file: any = {
        buffer: res.data,
        mimetype: 'image/jpeg',
        originalname: localBlobRecord.name,
      };
      const fileExt: string | any = extension(file.mimetype);

      const optimizedWallpaperSharp: sharp.Sharp = sharp(res.data)
        .resize(1920, 1440, { fit: 'inside', withoutEnlargement: true })
        .toFormat(fileExt, this.imagesStorage.getImageOutputOptions(MimeTypesEnum.JPEG));

      const thumbnailBlobPromise: Promise<string> = optimizedWallpaperSharp
        .clone()
        .resize(thumbnailSize.width, thumbnailSize.height, thumbnailSize.options)
        .toBuffer()
        .then((imageBuffer: Buffer) => {
          return this.storageService.createBlobFromMemory(container, thumbnailBlobName, file, imageBuffer);
        });

      const thumbnailBlobNames: string[] = await Promise.all([thumbnailBlobPromise]);

      return thumbnailBlobNames[0];
    } catch (error) {
      const errorMessage = `Error occured while getting blob record: ${localBlobRecord.name}`;
      this.logger.error({
        error: error.message,
        message: errorMessage,
      });
      throw new Error(errorMessage);
    }
  }
}
