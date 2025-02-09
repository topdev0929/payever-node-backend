import { HttpService, Injectable } from '@nestjs/common';
import { TokensGenerationService, TokensResultModel } from '@pe/nest-kit';
import * as FormData from 'form-data';
import * as url from 'url';
import * as FileType from 'file-type';
import { environment } from '../../environments';
import { MediaUploadResultDto } from '../dto';
import { BlobInterface } from '../interfaces/blob.interface';

@Injectable()
export class MediaUploadService {
  private microUrlMedia: string;
  private blobStorageUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly tokensGenerationService: TokensGenerationService,
  ) {
    this.microUrlMedia = environment.mediaServiceUrl;
    this.blobStorageUrl = environment.blobStorage;
  }

  public async uploadVideo(
    buffer: Buffer,
    container: string,
    businessId: string,
  ): Promise<MediaUploadResultDto> {
    const token: TokensResultModel = await this.tokensGenerationService.issueSystemToken(environment.applicationName);

    return this.upload(
      `/api/video/business/${businessId}/${container}`,
      buffer,
      container,
      token.accessToken,
    );
  }

  public async parseNameAndType(urlMedia: string): Promise<BlobInterface> {
    const regexp: RegExp = /[^-]+\-[^-]+\-[^-]+\-[^-]+\-[^-]+\-(.+)\.(.+)/g;
    const array: string[][] = [...urlMedia.matchAll(regexp)];
    const type: string = await this.getMimeTypeExtension(urlMedia);

    return {
      name: array[0][1],
      type: (type && type !== '') ? type : array[0][2],
    };
  }

  private async getMimeTypeExtension(mediaUrl: string): Promise<string> {
    const stream: any = await this.httpService.axiosRef(
      {
        method: 'GET',
        responseType: 'stream',
        url: mediaUrl,
      },
    );

    if (stream.data) {
      const fileType: any = await FileType.fromStream(stream.data);

      return fileType.ext;
    }
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

    return {
      previewUrl: uploadResponse.data.preview
        ? `${this.blobStorageUrl}/${container}/${uploadResponse.data.preview}`
        : null,
      sourceUrl: `${this.blobStorageUrl}/${container}/${uploadResponse.data.blobName}`,
    };
  }
}
