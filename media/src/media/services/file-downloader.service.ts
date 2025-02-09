import { Injectable, HttpService, Logger, BadRequestException } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { FileInterface, FsFile } from '..';
import { getTmpFilePath } from '../../tools';
import { v4 as uuid } from 'uuid';
import * as mimeTypes from 'mime-types';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

@Injectable()
export class FileDownloaderService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: Logger
  ) { }

  public async getFileInfo(url: string): Promise<FileInterface> {
    try {
      const response: AxiosResponse<any> = await this.httpService
        .head(url, { timeout: 5000 })
        .toPromise();

      const fileName = url.split('/').pop();
      const mimeType = response.headers['content-type'];
      const mimeTypeExt = mimeTypes.extension(mimeType);

      const fileInfo: FileInterface = {
        fileSize: response.headers['content-length'],
        mimeType: mimeType,
        originalFileName: fileName,
        uniqfileName: `${uuid()}-${path.parse(this.cleanFileName(fileName)).name
          }.${mimeTypeExt}`,
      };

      return fileInfo;
    } catch (error) {
      if (error.code === 'ENOTFOUND') {
        throw new BadRequestException({
          message: 'URL not valid',
          statusCode: 400,
        });
      }
      this.logger.error({
        error: error.message,
        message: 'Failed to compress image',
      });
    }
  }

  public async downloadFile(url: string, blobName?: string): Promise<FsFile> {
    const response = await this.httpService
      .get(url, {
        responseType: 'arraybuffer',
        timeout: 5000,
      })
      .toPromise();

    const localPath = getTmpFilePath(os.tmpdir());


    return new Promise((resolve: any, reject: any) => {
      const writer = fs.createWriteStream(localPath);

      writer.write(response.data);

      const orginFileName = url.split('/').pop();

      const fileName = orginFileName.includes('=') ? orginFileName.split('=').pop() : orginFileName;
      const mimeType = response.headers['content-type'];
      const mimeTypeExt = mimeTypes.extension(mimeType);
  
      const fileInfo: FsFile = {
        fileSize: response.headers['content-length'],
        mimeType,
        originalFileName: fileName,
        uniqfileName: blobName || `${uuid()}-${path.parse(this.cleanFileName(fileName)).name}.${mimeTypeExt}`,
        localPath,
      };

      writer.end();
      writer.on('finish', () => { resolve(fileInfo); });
      writer.on('error', reject);
    });
  }

  cleanFileName(input: string): string {
    return input
      .replace(/[^\w\d:.-_]/g, '-')
      .replace(/\s+/g, '')
      .replace(/\(|\)/g, '');
  }
}
