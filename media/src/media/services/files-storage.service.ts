import { Injectable, Logger } from '@nestjs/common';
import { BlobCreatedDto } from '../dto';
import * as sharp from 'sharp';
import { MimeTypesEnum } from '../../tools/mime-types.enum';
import { MediaServiceInterface, FsFile } from '../interfaces';
import { BlobStorageService } from '../../storage/services/blob-storage.service';
import { MediaItemService } from './media-item.service';
import { StorageContainerEnum } from '../enum';
import { BusinessMediaService, GenerateThumbnailService } from '.';
import { MediaItemModel } from '../models';

type FileToBlobFactory = (file: FsFile) => Promise<BlobCreatedDto>;
const MIMETYPES_FOR_TRANSFORMATION: MimeTypesEnum[] = [MimeTypesEnum.PDF];

@Injectable()
export class FilesStorage {
  constructor(
    private readonly storageService: BlobStorageService,
    private readonly mediaItemService: MediaItemService,
    private readonly generateThumbnailService: GenerateThumbnailService,
    private readonly businessMediaService: BusinessMediaService,
    private readonly logger: Logger,
  ) { }

  public storageFactory(
    dbService: MediaServiceInterface,
    userId: string,
    containerName: StorageContainerEnum,
    compress?: Boolean,
    applicationId?: string,
    generateThumbnail: boolean = true,
    businessId: string = null,
  ): FileToBlobFactory {
    return async (file: FsFile): Promise<BlobCreatedDto> => {
      const blobName: string = file.uniqfileName;
      let isCompressed: boolean = false;
      if (compress) {
        try {
          if (file.mimeType.includes('image')) {
            const image: sharp.Sharp = sharp(file.localPath);
            const { format }: any = await image.metadata();
            const config = {
              jpeg: { quality: 50 },
              webp: { quality: 50 },
              png: {
                compressionLevel: 9,
                adaptiveFiltering: true,
                force: true,
                quality: 50,
              },
            };
            const resImage = await image[format](config[format]).toBuffer();
            await sharp(resImage).toFile(file.localPath);
            isCompressed = true;
          }
        } catch (error) {
          this.logger.error({
            error: error.message,
            message: 'Failed to compress image',
          });
        }
      }
      await this.storageService.createBlobFromFs(
        file,
        containerName,
        file.uniqfileName,
      );

      await dbService.create(userId, containerName, blobName);
      await this.mediaItemService.create(blobName, containerName, applicationId);

      if (generateThumbnail) {
        let thumbnailBlobName: string = null;

        try {
          const localBlobRecord: MediaItemModel =
            await this.businessMediaService.findByName(businessId, containerName, blobName);
          thumbnailBlobName =
            await this.generateThumbnailService.generateFromFile(containerName as any, businessId, file);
        } catch (error) {
          this.logger.error({
            error: error.message,
            message: 'Failed to generate thumbnail',
          });
        }

        return {
          blobName,
          thumbnailBlobName: thumbnailBlobName,
          compress: isCompressed,
          fileSize: file.fileSize,
          mimeType: file.mimeType,
        };
      }

      return {
        blobName,
        compress: isCompressed,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
      };
    };
  }
}
