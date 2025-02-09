import { v4 as uuid } from 'uuid';
import * as AzureStorage from 'azure-storage';
import { extension } from 'mime-types';
import * as sharp from 'sharp';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { MediaAdditionalImageTypesEnum, MediaContainersEnum } from '@pe/media-sdk';
import { BlobCreatedDto, BlobThumbnailBlurDto } from '../dto';
import { MimeTypesEnum } from '../../tools/mime-types.enum';
import { FsFile, MemFile, MediaServiceInterface, ImageTransformResult } from '../interfaces';
import { BlobStorageService } from '../../storage/services/blob-storage.service';
import { MediaItemService } from './media-item.service';
import { ImageBrightnessResolver } from './image-brightness.resolver';
import { MediaCompressorWrapper } from '../../compressor/services';
import {
  ArgumentMediaContainerEnum,
  CdnContainerEnum,
  CdnMediaContainerEnum,
  MediaArgumentOrCdnContainerEnum,
  StorageContainerEnum,
} from '../enum';
import { getTmpFilePath, readFileAsync, withFolder, writeFileAsync } from '../../tools';
import { MediaResizeResolver } from './media-resize.resolver';
import { MediaItemModel } from '../models';

type FileToBlobFactory = (file: MemFile) => Promise<BlobCreatedDto>;
const MIMETYPES_FOR_TRANSFORMATION: MimeTypesEnum[] = [ MimeTypesEnum.JPEG, MimeTypesEnum.JPG, MimeTypesEnum.PNG ];

@Injectable()
export class ImagesStorage {
  private readonly CONTAINERS_WITH_THUMBNAILS: MediaArgumentOrCdnContainerEnum[] = [
    MediaContainersEnum.Wallpapers,
    MediaContainersEnum.Products,
    MediaContainersEnum.Builder,
    MediaContainersEnum.Social,
    MediaContainersEnum.Message,
    CdnMediaContainerEnum.Cdn_social,
    CdnMediaContainerEnum['Cdn_shop-images'],
    CdnMediaContainerEnum['Cdn_site-images'],
  ];
  private readonly CONTAINERS_WITH_GRID_THUMBNAILS: MediaArgumentOrCdnContainerEnum[] = [MediaContainersEnum.Products];
  private readonly CONTAINERS_WITH_BLURRED_IMAGES: MediaArgumentOrCdnContainerEnum[] = [MediaContainersEnum.Wallpapers];
  private readonly CONTAINERS_WITH_BLURRED_THUMBNAILS: MediaArgumentOrCdnContainerEnum[] =
    [MediaContainersEnum.Builder];
  private readonly CONTAINERS_WITH_MOBILE_IMAGES: MediaArgumentOrCdnContainerEnum[] = [MediaContainersEnum.Wallpapers];
  private readonly CONTAINERS_WITH_TABLET_IMAGES: MediaArgumentOrCdnContainerEnum[] = [MediaContainersEnum.Wallpapers];
  private readonly CONTAINERS_WITH_BLURRED_MOBILE_IMAGES: MediaArgumentOrCdnContainerEnum[] =
    [MediaContainersEnum.Wallpapers];
  private readonly CONTAINERS_WITH_BLURRED_TABLET_IMAGES: MediaArgumentOrCdnContainerEnum[] =
    [MediaContainersEnum.Wallpapers];
  private readonly CONTAINERS_WITH_ADDITIONAL_BLOBS: MediaArgumentOrCdnContainerEnum[] = [
    ...this.CONTAINERS_WITH_THUMBNAILS,
    ...this.CONTAINERS_WITH_BLURRED_IMAGES,
    ...this.CONTAINERS_WITH_BLURRED_THUMBNAILS,
    ...this.CONTAINERS_WITH_MOBILE_IMAGES,
    ...this.CONTAINERS_WITH_TABLET_IMAGES,
    ...this.CONTAINERS_WITH_BLURRED_MOBILE_IMAGES,
    ...this.CONTAINERS_WITH_BLURRED_TABLET_IMAGES,
    ...this.CONTAINERS_WITH_GRID_THUMBNAILS,
  ];
  @Inject(MediaResizeResolver) private readonly mediaSizeResolver: MediaResizeResolver;

  constructor(
    private logger: Logger,
    private readonly blobStorageService: BlobStorageService,
    private readonly mediaItemService: MediaItemService,
    private readonly mediaCompressor: MediaCompressorWrapper,
  ) { }

  // tslint:disable-next-line: cognitive-complexity
  public storageFactory(
    dbService: MediaServiceInterface,
    userId: string,
    containerName: ArgumentMediaContainerEnum | CdnMediaContainerEnum,
    fileUiid?: string,
    options: { skipResize?: boolean; skipGradient?: boolean } = {},
  ): FileToBlobFactory {
    return async (file: MemFile): Promise<BlobCreatedDto> => {
      return withFolder(async (folder: string) => {
        let blobName: string;
        let thumbnailCreated: boolean = false;

        const brightnessGradation: string = !options.skipGradient && isAllowedTransformImage(file)
          ? await ImageBrightnessResolver.getBrightnessGradation(file.buffer)
          : null;

        if (brightnessGradation && this.CONTAINERS_WITH_ADDITIONAL_BLOBS.includes(containerName)) {
          const blobThumbnailBlurDto: BlobThumbnailBlurDto = new BlobThumbnailBlurDto();

          blobThumbnailBlurDto.createThumbnail = this.CONTAINERS_WITH_THUMBNAILS.includes(containerName);
          blobThumbnailBlurDto.createBlurredBlob = this.CONTAINERS_WITH_BLURRED_IMAGES.includes(containerName);
          blobThumbnailBlurDto.createBlurredThumbnail = this.CONTAINERS_WITH_BLURRED_THUMBNAILS.includes(containerName);
          blobThumbnailBlurDto.createMobileSizeBlob = this.CONTAINERS_WITH_MOBILE_IMAGES.includes(containerName);
          blobThumbnailBlurDto.createTabletSizeBlob = this.CONTAINERS_WITH_TABLET_IMAGES.includes(containerName);
          blobThumbnailBlurDto.createBlurredMobileSize
            = this.CONTAINERS_WITH_BLURRED_MOBILE_IMAGES.includes(containerName);
          blobThumbnailBlurDto.createBlurredTabletSize
            = this.CONTAINERS_WITH_BLURRED_TABLET_IMAGES.includes(containerName);
          blobThumbnailBlurDto.createGridThumbnailImage = this.CONTAINERS_WITH_GRID_THUMBNAILS.includes(containerName);

          if (file.buffer.byteLength > 5000000) { // compress if bigger than 5mb
            const imagePath: string = getTmpFilePath(folder);
            await writeFileAsync(imagePath, file.buffer);
            const compressedImagePath: string = getTmpFilePath(folder);
            await this.mediaCompressor.compress(file.mimetype as MimeTypesEnum, imagePath, compressedImagePath);
            file.buffer = await readFileAsync(compressedImagePath);
          }

          thumbnailCreated = blobThumbnailBlurDto.createThumbnail;
          const uploadPromises: Array<PromiseSettledResult<string>> = await Promise.allSettled(
            (await this.createBlobsWithThumbnailAndBlur(
              containerName,
              file,
              blobThumbnailBlurDto,
              fileUiid,
              options.skipResize,
            )).map(async (uploadPromise: Promise<string>) => {
              const uploadBlobName: string = await uploadPromise;
              await dbService.create(userId, containerName, uploadBlobName);
              await this.mediaItemService.create(uploadBlobName, containerName);

              return uploadBlobName;
            }),
          );
          for (const promise of uploadPromises) {
            if (promise.status === 'rejected') {
              // unpublish all successfully uploaded files
              throw promise.reason;
            }
          }

          blobName = (uploadPromises[0] as PromiseFulfilledResult<string>).value;
        } else {
          const fsFile: FsFile = {
            fileSize: file.buffer.length,
            localPath: getTmpFilePath(folder),
            mimeType: file.mimetype,
            originalFileName: file.originalname,
            uniqfileName: file.originalname,
          };
          await writeFileAsync(fsFile.localPath, file.buffer);
          // eslint-disable-next-line prefer-const
          let [storageContainerName, storageBlobName]: [StorageContainerEnum, string] =
            this.blobStorageService.getContainerAndBlobNames(
              fileUiid || fsFile.uniqfileName,
              containerName,
              true,
              true,
            );

          const mediaItemModel: MediaItemModel =
            await this.mediaItemService.create(storageBlobName, storageContainerName);
          storageBlobName = mediaItemModel.name;

          await this.blobStorageService.createBlobFromFs(
            fsFile,
            storageContainerName,
            storageBlobName,
          );

          await dbService.create(userId, storageContainerName, storageBlobName);
          blobName = storageBlobName;
        }

        const cleanBlobName: string = blobName
          .replace(`${MediaContainersEnum.CdnShopImages}/`, '')
          .replace(`${MediaContainersEnum.CdnSiteImages}/`, '');

        return {
          blobName: cleanBlobName,
          brightnessGradation,
          thumbnail: thumbnailCreated ? `${cleanBlobName}-thumbnail` : null,
        };
      });
    };
  }

  public async createAdditionalImageFromBlob(
    blobName: string,
    container: MediaContainersEnum,
    imageType: MediaAdditionalImageTypesEnum,
  ): Promise<void> {
    const properties: AzureStorage.BlobService.BlobResult =
      await this.blobStorageService.getBlobProperties(blobName, container);
    if (!properties) {
      this.logger.warn(`Blob "${blobName}" not found in container "${container}"`);

      return;
    }

    await withFolder(async (folder: string) => {
      const outputFilePath: string = getTmpFilePath(folder);
      await this.blobStorageService.downloadBlobContent(blobName, container, outputFilePath);
      const fileBuffer: Buffer = await readFileAsync(outputFilePath);
      const newBlobName: string = await this.blobStorageService.createBlobWithParameters(
        {
          buffer: fileBuffer,
          mimetype: properties.contentSettings.contentType,
          originalname: blobName,
        },
        `${blobName}-${imageType}`,
        this.mediaSizeResolver.getTransformParametersFor(container, imageType),
        container,
      );

      this.logger.log(`Blob "${newBlobName}" created at container "${container}"`);
    });
  }

  public async createBlobsWithThumbnailAndBlur(
    containerArg: ArgumentMediaContainerEnum | CdnMediaContainerEnum,
    file: MemFile,
    blobThumbnailBlurDto: BlobThumbnailBlurDto,
    fileUiid?: string,
    skipResize: boolean = false,
  ): Promise<Array<Promise<string>>> {
    const result = [];
    const blobFilteredName: string = file.originalname
      .replace(/\s+/g, '')
      .replace(/\(|\)/g, '');

    let blobName: string = fileUiid ? fileUiid : `${uuid()}-${blobFilteredName}`;

    let container: CdnContainerEnum | ArgumentMediaContainerEnum;

    if (containerArg.indexOf('/') !== -1) {
      const path: string = `${containerArg}/${blobName}`;
      const paths: string[] = path.split('/');
      container = (paths.shift()) as CdnContainerEnum.Cdn;
      blobName = paths.join('/');
    } else {
      container = containerArg as ArgumentMediaContainerEnum;
    }

    const blurredBlobName: string = `${blobName}-blurred`;
    const thumbnailBlobName: string = `${blobName}-thumbnail`;
    const mobileSizeBlobName: string = `${blobName}-mobile`;
    const blurredMobileSizeBlobName: string = `${blobName}-mobile-blurred`;
    const tabletSizeBlobName: string = `${blobName}-tablet`;
    const blurredTabletSizeBlobName: string = `${blobName}-tablet-blurred`;
    const blurredThumbnailBlobName: string = `${blobName}-blurred-thumbnail`;
    const gridThumbnailBlobName: string = `${blobName}-grid-thumbnail`;

    const opacityValue: number = await this.getOpacity(file);
    const opacitySVG: Buffer = Buffer.from(
      `<svg><rect width="10" height="10" fill="#000000" fill-opacity="${opacityValue}"/></svg>`,
    );

    const fileExt: string | any = extension(file.mimetype);

    let optimizedWallpaperSharp: sharp.Sharp;

    if (skipResize) {
      optimizedWallpaperSharp = sharp(file.buffer)
        .toFormat(fileExt, this.getImageOutputOptions(file.mimetype as MimeTypesEnum));
    } else {
      optimizedWallpaperSharp = sharp(file.buffer)
        .resize(1920, 1440, { fit: 'inside', withoutEnlargement: true })
        .toFormat(fileExt, this.getImageOutputOptions(file.mimetype as MimeTypesEnum));
    }

    const blob: Promise<string> = optimizedWallpaperSharp
      .clone()
      .toBuffer()
      .then((imageBuffer: Buffer) => {
        return this.blobStorageService.createBlobFromMemory(container, blobName, file, imageBuffer);
      });
    result.push(blob);

    if (blobThumbnailBlurDto.createThumbnail) {

      const thumbnailSize: ImageTransformResult = this.mediaSizeResolver.getTransformParametersFor(
        container as MediaContainersEnum,
        MediaAdditionalImageTypesEnum.Thumbnail,
      );

      const thumbnailBlobPromise: Promise<string> = optimizedWallpaperSharp
        .clone()
        .resize(thumbnailSize.width, thumbnailSize.height, thumbnailSize.options)
        .toBuffer()
        .then((imageBuffer: Buffer) => {
          return this.blobStorageService.createBlobFromMemory(container, thumbnailBlobName, file, imageBuffer);
        });
      
      result.push(thumbnailBlobPromise);
    }

    if (blobThumbnailBlurDto.createGridThumbnailImage) {
      const gridThumbnailSize: ImageTransformResult = this.mediaSizeResolver.getTransformParametersFor(
        container as MediaContainersEnum,
        MediaAdditionalImageTypesEnum.GridThumbnail,
      );

      const gridThumbnailBlobPromise: Promise<string> = optimizedWallpaperSharp
        .clone()
        .resize(gridThumbnailSize.width, gridThumbnailSize.height, gridThumbnailSize.options)
        .toBuffer()
        .then((imageBuffer: Buffer) => {
          return this.blobStorageService.createBlobFromMemory(container, gridThumbnailBlobName, file, imageBuffer);
        });

      result.push(gridThumbnailBlobPromise);
    }

    if (blobThumbnailBlurDto.createMobileSizeBlob) {
      const mobileBlobPromise: Promise<string> = optimizedWallpaperSharp
        .clone()
        .resize(640, 480, { fit: 'outside', withoutEnlargement: true })
        .toBuffer()
        .then((imageBuffer: Buffer) => {
          return this.blobStorageService.createBlobFromMemory(container, mobileSizeBlobName, file, imageBuffer);
        });

      result.push(mobileBlobPromise);
    }

    if (blobThumbnailBlurDto.createBlurredMobileSize) {
      const blurredMobileBlobPromise: Promise<string> = optimizedWallpaperSharp
        .clone()
        .resize(640, 480, { fit: 'outside', withoutEnlargement: true })
        .toFormat(fileExt, { progressive: true, quality: 50 })
        .blur(8)
        .composite([{ input: opacitySVG, tile: true }])
        .toBuffer()
        .then((imageBuffer: Buffer) => {
          return this.blobStorageService.createBlobFromMemory(container, blurredMobileSizeBlobName, file, imageBuffer);
        });

      result.push(blurredMobileBlobPromise);
    }

    if (blobThumbnailBlurDto.createTabletSizeBlob) {
      const tabletBlobPromise: Promise<string> = optimizedWallpaperSharp
        .clone()
        .resize(1024, 768, { fit: 'outside', withoutEnlargement: true })
        .toBuffer()
        .then((imageBuffer: Buffer) => {
          return this.blobStorageService.createBlobFromMemory(container, tabletSizeBlobName, file, imageBuffer);
        });

      result.push(tabletBlobPromise);
    }

    if (blobThumbnailBlurDto.createBlurredTabletSize) {
      const blurredTabletBlobPromise: Promise<string> = optimizedWallpaperSharp
        .clone()
        .resize(1024, 768, { fit: 'outside', withoutEnlargement: true })
        .toFormat(fileExt, { progressive: true, quality: 50 })
        .blur(12)
        .composite([{ input: opacitySVG, tile: true }])
        .toBuffer()
        .then((imageBuffer: Buffer) => {
          return this.blobStorageService.createBlobFromMemory(container, blurredTabletSizeBlobName, file, imageBuffer);
        });

      result.push(blurredTabletBlobPromise);
    }

    if (blobThumbnailBlurDto.createBlurredBlob) {
      const blurredBlobPromise: Promise<string> = sharp(file.buffer)
        .resize(1920, 1440, { fit: 'inside', withoutEnlargement: true })
        .toFormat(fileExt)
        .blur(150)
        .toBuffer()
        .then((imageBuffer: Buffer) => {
          return this.blobStorageService.createBlobFromMemory(container, blurredBlobName, file, imageBuffer);
        });

      result.push(blurredBlobPromise);
    }

    if (blobThumbnailBlurDto.createBlurredThumbnail) {
      const blurredThumbnailBlobPromise: Promise<string> = optimizedWallpaperSharp
        .clone()
        .resize(450, 300, { fit: 'outside', withoutEnlargement: true })
        .toFormat(fileExt, { progressive: true, quality: 80 })
        .blur(3)
        .composite([{ input: opacitySVG, tile: true }])
        .toBuffer()
        .then((imageBuffer: Buffer) => {
          return this.blobStorageService.createBlobFromMemory(container, blurredThumbnailBlobName, file, imageBuffer);
        });

      result.push(blurredThumbnailBlobPromise);
    }

    return result;
  }

  public getImageOutputOptions(mimeType: MimeTypesEnum): { progressive: boolean; quality: number} {
    return {
        progressive: true,
        quality: 75,
      };
  }

  private async getOpacity(file: MemFile): Promise<number> {
    let opacityValue: number = 0.3;
    try {
      await sharp(file.buffer).stats().then(
        ({ channels: [rc, gc, bc] }: sharp.Stats) => {
          let channelCount: number = 0;
          if (rc) { channelCount++; }
          if (gc) { channelCount++; }
          if (bc) { channelCount++; }

          const rcMean: number = rc ? rc.mean / channelCount : 0;
          const gcMean: number = gc ? gc.mean / channelCount : 0;
          const bcMean: number = bc ? bc.mean / channelCount : 0;
          opacityValue = Math.ceil((Math.round(rcMean + gcMean + bcMean) / 260) * 100) / 100;
        });
    } catch (e) {
      this.logger.log(e);
    }

    return opacityValue;
  }
}

function isAllowedTransformImage(file: MemFile): boolean {
  return MIMETYPES_FOR_TRANSFORMATION.includes(file.mimetype.toLowerCase() as MimeTypesEnum);
}
