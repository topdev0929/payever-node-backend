import { HttpService, Injectable, Logger } from '@nestjs/common';
import { environment } from '../../environments';
import * as FormData from 'form-data';
import { ImportFailedException } from '../../exceptions';
import { AxiosResponse } from 'axios';
import * as FileType from 'file-type';

@Injectable()
export class ProductCopyImageService {
  constructor(private readonly logger: Logger, private readonly httpService: HttpService) { }

  /* istanbul ignore next */
  public async importImages(images: string[], businessUuid: string, throwException: boolean = true): Promise<string[]> {
    if (!(images instanceof Array)) {
      return [];
    }

    const names: string[] = await Promise.all(
      images.map(async (imageUrl: string) => {
        return this.pipeImageToPayever(imageUrl, businessUuid, throwException);
      }),
    );
    // sometimes some of images names are resolved to `null`
    // problem may be in `media` micro, but not found yet
    // so just clean invalid values

    return names.filter((name: string | null) => name !== null);
  }

  private async pipeImageToPayever(imageUrl: string, businessUuid: string, throwException: boolean): Promise<string> {
    /* istanbul ignore next */
    try {
      const res: AxiosResponse = await this.httpService.get(imageUrl, { responseType: 'arraybuffer' }).toPromise();
      const type: any = await FileType.fromBuffer(res.data);
      const form: FormData = new FormData();

      form.append('file', res.data, `products.${type.ext}`);

      const uploadResponse: AxiosResponse = await this.httpService
        .post(`${environment.microUrlMedia}/api/image/business/${businessUuid}/products`, form, {
          headers: {
            'Content-Length': form.getLengthSync(),
            ...form.getHeaders(),
          },
        })
        .toPromise();
      // null could be here

      return uploadResponse.data.blobName;
    } catch (e) {
      this.logger.error({
        context: 'ProductCopyImageService',
        e,
        message: `Failed downloading image: ${imageUrl}, businessUuid: ${businessUuid}`,
      });

      if (throwException) {
        throw new ImportFailedException(`Failed downloading image: ${imageUrl}`, businessUuid);
      }

      return '';
    }
  }
}
