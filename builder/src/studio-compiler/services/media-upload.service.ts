import { HttpService, Injectable, Logger } from '@nestjs/common';
import { TokensGenerationService, TokensResultModel } from '@pe/nest-kit';
import * as FormData from 'form-data';
import * as url from 'url';
import { environment } from '../../environments';
import { MediaTypeEnum } from '../enums';
import { MediaUploadResultInterface } from '../interfaces';

@Injectable()
export class MediaUploadService {
  private microUrlMedia: string;
  private blobStorageUrl: string;
  private applicationName: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly tokensGenerationService: TokensGenerationService,
    private readonly logger: Logger,
  ) {
    this.microUrlMedia = environment.mediaServiceUrl;
    this.blobStorageUrl = environment.blobStorage;
    this.applicationName = environment.applicationName;
  }

  public async uploadMedia(
    buffer: Buffer,
    businessId: string,
    type: MediaTypeEnum,
  ): Promise<MediaUploadResultInterface> {
    const token: TokensResultModel = await this.tokensGenerationService.issueSystemToken(environment.applicationName);
    const container: string = type === MediaTypeEnum.IMAGE ? 'miscellaneous' : 'builder-video';
    const api: string = type === MediaTypeEnum.IMAGE ? `/api/image/business/${businessId}/${container}`
      : `/api/video/business/${businessId}/${container}`;

    return this.upload(
      api,
      buffer,
      container,
      token.accessToken,
    );
  }

  private async upload(
    endpoint: string,
    buffer: Buffer,
    container: string,
    token: string,
  ): Promise<MediaUploadResultInterface> {
    this.logger.log('Uploading...');

    const form: any = new FormData();

    form.append('file', buffer, 'media');
    let uploadResponse: any;

    try {
    uploadResponse = await this.httpService.post(
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
    } catch (e) {
      this.logger.log(`Error: ${e.message}`);
    }

    return {
      previewUrl: uploadResponse.data.preview
        ? `${this.blobStorageUrl}/${container}/${uploadResponse.data.preview}`
        : null,
      sourceUrl: `${this.blobStorageUrl}/${container}/${uploadResponse.data.blobName}`,
    };
  }
}
