import { HttpService, Injectable, Logger } from '@nestjs/common';
import * as url from 'url';
import { MediaUploadResultDto } from '../dto';
import * as FormData from 'form-data';
import { environment } from '../../environments';

@Injectable()
export class MediaServiceClient {
  private microUrlMedia: string;
  private blobStorageUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly logger: Logger,
  ) {
    this.microUrlMedia = environment.mediaServiceUrl;
    this.blobStorageUrl = environment.blobStorage;
  }

  public async uploadImage(buffer: Buffer, container: string, businessId: string): Promise<MediaUploadResultDto> {
    return this.upload(
      `/api/image/business/${businessId}/${container}`,
      buffer,
      container,
      null,
    );
  }

  private async upload(
    endpoint: string, 
    buffer: Buffer, 
    container: string, 
    token: string,
  ): Promise<MediaUploadResultDto> {
    const form: any = new FormData();

    form.append('file', buffer, 'media');

    const uploadResponse: any = await this.httpService.post(
      url.resolve(this.microUrlMedia, endpoint),
      form,
      {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Length': form.getLengthSync(),
          ...form.getHeaders(),
        },
      })
      .toPromise();

    const sourceUrl: string = `${this.blobStorageUrl}/${container}/${uploadResponse.data.blobName}`;

    this.logger.log(`Uploaded media "${sourceUrl}"`);

    return {
      brightness: uploadResponse.data.brightnessGradation,
      previewUrl: uploadResponse.data.preview
        ? `${this.blobStorageUrl}/${container}/${uploadResponse.data.preview}`
        : null,
      sourceUrl,
    };
  }
}
