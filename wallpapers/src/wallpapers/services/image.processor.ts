import { Injectable } from '@nestjs/common';
import { MediaServiceClient } from './media-service.client';
import { MediaUploadResultDto } from '../dto';
import * as sharp from 'sharp';
import * as fs from 'fs';

@Injectable()
export class ImageProcessor {

  constructor(
    private readonly mediaServiceClient: MediaServiceClient,
  ) { }

  public async upload(tmpFilePath: string, businessId: string): Promise<MediaUploadResultDto> {
    const resized: Buffer = await sharp(fs.readFileSync(tmpFilePath))
      .resize(1920, 1440, { fit: 'inside', withoutEnlargement: true })
      .toFormat('png')
      .toBuffer();
    fs.unlinkSync(tmpFilePath);

    return this.mediaServiceClient.uploadImage(
      resized,
      'builder',
      businessId,
    );
  }
}
