import { HttpService, Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as FileType from 'file-type';
import { DownloadResultInterface } from '../interfaces';


@Injectable()
export class DownloaderService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: Logger,
  ) {
  }

  public async download(
    id: string,
    folder: string,
    url: string,
  ): Promise<DownloadResultInterface> {
    this.logger.log(`Downloading ${url}`);
    try {
      const stream: any = await this.httpService.axiosRef(
        {
          method: 'GET',
          responseType: 'stream',
          url: url,
        },
      );
      const extension: string = await this.getMime(url);
      const file: string = `${folder}/${id}.${extension}`;
      const writer: fs.WriteStream = fs.createWriteStream(file);
      stream.data.pipe(writer);

      return new Promise((resolve: any, reject: any) => {
        writer.on('finish', () => {
          resolve({ file, extension });
        });
        writer.on('error', reject);
      });
    } catch (err) {
      this.logger.log(`Error downloading ${url}: ${err}`);
    }
  }

  private async getMime(url: string): Promise<string> {
    const stream: any = await this.httpService.axiosRef(
      {
        method: 'GET',
        responseType: 'stream',
        url: url,
      },
    );
    const fileType: any = await FileType.fromStream(stream.data);

    return fileType.ext;
  }

}
