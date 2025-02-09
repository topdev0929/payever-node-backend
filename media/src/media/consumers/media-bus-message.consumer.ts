import { Controller, BadRequestException } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AdditionalImageRequestDto, MediaDto, MediaRabbitEvents } from '@pe/media-sdk';

import { MessageBusChannelsEnum } from '../enums';
import { FsFile } from '../interfaces';
import {
  BusinessMediaService,
  FileDownloaderService,
  FilesStorage,
  ImagesStorage,
  MediaItemService,
} from '../services';
import { ImageUploadFromUrlRequest } from '../dto';

@Controller()
export class MediaBusMessageConsumer {
  constructor(
    private readonly mediaItemService: MediaItemService,
    private readonly imagesStorage: ImagesStorage,
    private readonly fileDownloaderService: FileDownloaderService,
    private readonly filesStorage: FilesStorage,
    private readonly businessMediaService: BusinessMediaService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.media,
    name: MediaRabbitEvents.MediaAssigned,
  })
  public async onMediaAssignedEvent(data: MediaDto): Promise<void> {
    await this.mediaItemService.associate(data.filename, data.container, data.relatedEntity);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.media,
    name: MediaRabbitEvents.MediaRemoved,
  })
  public async onMediaRemovedEvent(data: MediaDto): Promise<void> {
    await this.mediaItemService.disassociate(data.filename, data.container, data.relatedEntity);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.media,
    name: MediaRabbitEvents.AdditionalImageRequested,
  })
  public async onAdditionalMediaRequested(data: AdditionalImageRequestDto): Promise<void> {
    await this.imagesStorage.createAdditionalImageFromBlob(data.filename, data.container, data.imageType);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.uploadRequests,
    name: MediaRabbitEvents.UploadImageFromUrlRequested,
  })
  public async onUploadImageFromUrlRequested(data: ImageUploadFromUrlRequest): Promise<void> {
    const fileInfo = await this.fileDownloaderService.getFileInfo(data.url);
    if (fileInfo.fileSize > 1024 * 1024 * 10) {
      throw new BadRequestException({
        message: 'Document type is not correct',
        statusCode: 400,
      });
    }

    const uploadedFileInfo: FsFile = await this.fileDownloaderService.downloadFile(data.url, data.blobName);
    const fileStorageFactory = this.filesStorage.storageFactory(
      this.businessMediaService,
      data.businessId,
      data.container,
      data.compress,
      data.businessId,
      data.generateThumbnail,
      data.businessId
    );
    await fileStorageFactory(uploadedFileInfo);
  }
}

