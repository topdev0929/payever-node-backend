import { Injectable } from '@nestjs/common';
import { MediaServiceClient } from '../media-service.client';
import { MediaUploadResultDto } from '../../../dtos';
import * as sharp from 'sharp';
import { File } from '../../../interfaces';
import { MediaTypeEnum } from '../../../enums';

@Injectable()
export class ImageProcessor {

  constructor(
    private readonly mediaServiceClient: MediaServiceClient,
  ) { }

  public async upload(file: File, businessId: string): Promise<MediaUploadResultDto> {
    return this.mediaServiceClient.uploadImage(
      file.buffer,
      'social',
      businessId,
    );
  }

  public async delete(blobName: string, businessId: string): Promise<void> {
    return this.mediaServiceClient.deleteImage(
      businessId,
      blobName,
      'social',
    );
  }

  public doesSupport(type: MediaTypeEnum): boolean {
    return type === MediaTypeEnum.Image;
  }
}
