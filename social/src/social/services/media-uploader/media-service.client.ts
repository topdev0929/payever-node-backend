import { HttpService, Injectable, Logger, HttpException } from '@nestjs/common';
import * as url from 'url';
import { MediaUploadResultDto } from '../../dtos';
import * as FormData from 'form-data';
import { environment } from '../../../environments';

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
      `/api/image/business/${businessId}/cdn/${container}`,
      buffer,
      container,
      null,
    );
  }

  public async deleteImage(businessId: string, blobName: string, container: string): Promise<void> {
    return this.delete(
      url.resolve(this.microUrlMedia, `/api/image/business/${businessId}/${container}/${blobName}`),
      null,
    );
  }

  private async upload(
    endpoint: string, 
    buffer: Buffer, 
    container: string, 
    token: string,
  ): Promise<MediaUploadResultDto> {
    const form: any = new FormData({ maxDataSize: 10 * 1024 * 1024 });
    form.append('file', buffer, 'media.jpeg');

    let uploadResponse: any;
    try {
      uploadResponse = await this.httpService.post(
        url.resolve(this.microUrlMedia, endpoint),
        form,
        {
          headers: {
            'Content-Length': form.getLengthSync(),
            ...form.getHeaders(),
          },
        })
        .toPromise();
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(`media service is not available`, 503);
    }
    const sourceUrl: string = `${this.blobStorageUrl}/cdn/${uploadResponse.data.blobName}`;
    this.logger.log(`Uploaded media "${sourceUrl}"`);

    return {
      previewUrl: uploadResponse.data.preview
        ? `${this.blobStorageUrl}/cdn/${uploadResponse.data.preview}`
        : null,
      sourceUrl,
      thumbnail: uploadResponse.data.thumbnail
        ? `${this.blobStorageUrl}/cdn/${uploadResponse.data.thumbnail}`
        : null,
    };
  }

  private async delete(endpoint: string, token: string): Promise<void> {
    try {
      const uploadResponse: any = await this.httpService.delete(
        url.resolve(this.microUrlMedia, endpoint),
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        },
      )
        .toPromise();
      await uploadResponse;
    } catch (e) {
      this.logger.warn(e);
      this.logger.warn(`Error occurred on media removal "${endpoint}"`);
    }
  }
}
