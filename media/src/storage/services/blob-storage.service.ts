import { createReadStream, createWriteStream } from 'fs';
import { Readable, Writable, Duplex, PassThrough } from 'stream';
import * as AzureStorage from 'azure-storage';
import ListBlobsResult = AzureStorage.services.blob.blobservice.BlobService.ListBlobsResult;
import BlobResult = AzureStorage.services.blob.blobservice.BlobService.BlobResult;
import * as intoStream from 'into-stream';
import * as sharp from 'sharp';
import { v4 as uuid } from 'uuid';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { MediaContainersEnum } from '@pe/media-sdk';
import { MemFile, FsFile, StreamFile, ImageTransformResult } from '../../media/interfaces';
import { MimeTypesEnum } from '../../tools/mime-types.enum';
import { MediaCompressorWrapper } from '../../compressor/services';
import { StorageContainerEnum, CdnContainerEnum, ArgumentMediaContainerEnum } from '../../media/enum/cdn-media-containers.enum';
import { getFileSize, getTmpFilePath, withFolder } from '../../tools';
import { CompressResult } from '../../compressor/interfaces';
import { environment } from '../../environments';
@Injectable()
export class BlobStorageService {
  @Inject() private blobService: AzureStorage.BlobService;
  @Inject() private logger: Logger;
  @Inject() private readonly compressorWrapper: MediaCompressorWrapper;

  public getContainerAndBlobNames(
    fileName: string,
    containerArg: StorageContainerEnum,
    removeExtension: boolean = true,
    preserveName: boolean = false,
    fileUiid?: string,
  ): [StorageContainerEnum, string] {
    let blobName: string;
    if (fileUiid) {
      blobName = fileUiid;
    } else {
      const blobFilename: string = removeExtension
      ? fileName.replace(/\.[^.]*$/g, '')
      : fileName;
      blobName = preserveName
      ? blobFilename
      : `${uuid()}-${blobFilename}`;
    }

    let container: CdnContainerEnum | ArgumentMediaContainerEnum;

    if (containerArg.indexOf('/') !== -1) {
      const path: string = `${containerArg}/${blobName}`;
      const paths: string[] = path.split('/');
      container = (paths.shift()) as CdnContainerEnum.Cdn;
      if (paths.length > 1 && paths[0] === paths[1]) {
        paths.shift();
      }
      blobName = paths.join('/');
    } else {
      container = containerArg as ArgumentMediaContainerEnum;
    }

    return [container, blobName];
  }

  public async createBlobFromStream(
    file: Pick<StreamFile, 'stream' | 'fileSize' | 'mimeType'>,
    container: string,
    blobName: string,
  ): Promise<void> {    
    return new Promise<void>(
      (
        resolve: (value?: void) => void,
        reject: (reason?: Error) => void,
      ) => {
      // not sure that streaming actually works, looks like nest and multer wait till final
      this.blobService.createBlockBlobFromStream(
        container,
        blobName,
        (new Readable()).wrap(file.stream),
        file.fileSize,
        {
          contentSettings: {
            contentDisposition: `attachment; filename="${blobName}"`,
            contentType: file.mimeType,
          },
        },
        (err: Error) => {
          err ?
            reject(err) :
            resolve();
        },
      );
    });
  }

  public async createBlobFromFs(
    file: Pick<FsFile, 'localPath' | 'fileSize' | 'mimeType'>,
    container: string,
    blobName: string,
  ): Promise<void> {    
    return this.createBlobFromStream(
      {
        fileSize: file.fileSize,
        mimeType: file.mimeType,
        stream: createReadStream(file.localPath),
      },
      container,
      blobName,
    );
  }

  public async compressBlob(
    blobName: string,
    container: MediaContainersEnum,
  ): Promise<void> {
    const properties: AzureStorage.BlobService.BlobResult = await this.getBlobProperties(blobName, container);
    if (!properties) {
      this.logger.warn(`Blob "${blobName}" not found in container "${container}"`);

      return;
    }

    const mimeType: MimeTypesEnum = properties.contentSettings.contentType as MimeTypesEnum;

    if (!this.compressorWrapper.doesSupport(mimeType)) {
      this.logger.warn(`Content type "${mimeType}" doesn't have any compressors`);

      return;
    }

    return withFolder(async (folder: string) => {
      const blobFilePath: string = getTmpFilePath(folder);
      await this.downloadBlobContent(blobName, container, blobFilePath);
      const compressedFilePath: string = getTmpFilePath(folder);
      const compressResult: CompressResult =
        await this.compressorWrapper.compress(mimeType, blobFilePath, compressedFilePath);
      await this.createBlobFromFs(
        {
          fileSize: await getFileSize(compressedFilePath),
          localPath: compressedFilePath,
          mimeType: compressResult.mimeType || properties.contentSettings.contentType,
        },
        container,
        blobName,
      );

      this.logger.log(`Blob "${blobName}" compressed at container "${container}"`);
    });
  }

  public async createBlobWithParameters(
    file: MemFile,
    newName: string,
    resizeDimensions: ImageTransformResult,
    container: MediaContainersEnum,
  ): Promise<string> {
    const resizedBlob: any = sharp(file.buffer)
      .resize(resizeDimensions.width, resizeDimensions.height, resizeDimensions.options);

    if (resizeDimensions.blur) {
      resizedBlob.blur(resizeDimensions.blur);
    }
    const imageBuffer: Buffer = await resizedBlob.toBuffer();

    await this.createBlobFromMemory(container, newName, file, imageBuffer);

    return newName;
  }

  public async deleteBlob(container: string, blobName: string): Promise<void> {
    return new Promise<void>(
      (
        resolve: () => void,
        reject: (reason?: Error) => void,
      ) => {
      this.blobService.deleteBlob(container, blobName, (err: Error) => {
        err ? reject(err) : resolve();
      });
    });
  }

  public async createBlobFromMemory(
    container: StorageContainerEnum,
    blobName: string,
    file: MemFile,
    imageBuffer: Buffer,
  ): Promise<string> {
    await this.createBlobFromStream(
      {
        fileSize: imageBuffer.length,
        mimeType: file.mimetype,
        stream: intoStream(imageBuffer),
      },
      container,
      blobName,
    );

    return blobName;
  }

  // temp
  public async listContainers(): Promise<void> {
    return this.blobService.listContainersSegmented(
      null,
      null,
      (err: Error, res: AzureStorage.BlobService.ListContainerResult) => {
      this.logger.log('containers ' + err + res);
      },
    );
  }

  public async listBlobs(container: string): Promise<void> {
    this.blobService.listBlobsSegmented('images', null, (err: Error, res: AzureStorage.BlobService.ListBlobsResult) => {
      for (const blob of res.entries) {
        this.logger.log(blob);
        const sasUrl: string = this.blobService.getUrl('pictures', blob.name, null, true);
        this.logger.log('URL' + sasUrl);
      }
    });
  }

  public downloadBlobContent(
    blobName: string,
    container: MediaContainersEnum,
    outputFilePath: string,
  ): Promise<void> {
    // tslint:disable-next-line: typedef
    return new Promise(((resolve, reject): void => {
      this.blobService.getBlobToStream(
        container,
        blobName,
        createWriteStream(outputFilePath),
        (error: Error) => {
          if (error) {
            this.logger.warn(error);
            reject(error);
          } else {
            resolve();
          }
        },
      );
    }));
  }

  public getBlobProperties(
    blobName: string,
    container: MediaContainersEnum,
  ): Promise<AzureStorage.BlobService.BlobResult> {
    return new Promise(((resolve: (res?: AzureStorage.BlobService.BlobResult) => void): void => {
      this.blobService.getBlobProperties(
        container,
        blobName,
        (error: Error, properties: AzureStorage.BlobService.BlobResult) => {
          return resolve(properties);
        },
      );
    }));
  }

  public async getList(containerName: MediaContainersEnum, token: any ): Promise<ListBlobsResult> {
    return new Promise<ListBlobsResult>((resolve: any, reject: any) => {
      this.blobService.listBlobsSegmented(
        containerName,
        token,
        {
          include: 'deleted',
          maxResults: 100,
        },
        (err: any, result: any) => {
          err ? reject(err) : resolve(result);
        },
      );
    });
  }

  public async restoreRemoved(container: MediaContainersEnum, entries: BlobResult[]): Promise<any> {
    const chunkSize: number = 10;
    let restorePromises: Array<Promise<any>> = [];
    for (const blobResult of entries) {

      if (!blobResult.deleted) {
        continue;
      }

      restorePromises.push(
        this.restoreImage(container, blobResult.name),
      );

      if (restorePromises.length === chunkSize) {
        await Promise.all(restorePromises);
        restorePromises = [];
      }
    }

    if (restorePromises.length > 0) {
      await Promise.all(restorePromises);
    }
  }

  public async createContainer(containerName: string, options: any = null): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      this.blobService.createContainer(
        containerName,
        options,
        (error: any, result: any) => error ? reject(error) : resolve(result),
      );
    });
  }
  
  public async getContainerProperties(containerName: string, options: any = null): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      this.blobService.getContainerProperties(
        containerName,
        options,
        (error: any, result: any) => error ? reject(error) : resolve(result),
      );
    });
  }

  public async getContainerMetadata(containerName: string, options: any = null): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      this.blobService.getContainerMetadata(
        containerName,
        options,
        (error: any, result: any) => error ? reject(error) : resolve(result),
      );
    });
  }

  public async deleteContainer(containerName: string, options: any = null): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      this.blobService.deleteContainer(
        containerName,
        options,
        (error: any, result: any) => error ? reject(error) : resolve(result),
      );
    });
  }

  public async doesContainerExist(containerName: string): Promise<boolean> {    
    return new Promise((resolve: any, reject: any) => {
      this.blobService.doesContainerExist(
        containerName,
        (error: any, result: any) => error ? reject(error) : resolve(result.exists),
      );
    });
  }

  public async listContainersSegmented(continuationToken: any = null): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      this.blobService.listContainersSegmented(
        continuationToken,
        (error: any, result: any) => error ? reject(error) : resolve(result),
      );
    });
  }

  private async restoreImage(containerName: MediaContainersEnum, blobName: string): Promise<any> {
    this.logger.log(`Restoring "${blobName}" as "${containerName}"`);

    return new Promise<void>((resolve: any, reject: any) => {
      this.blobService.undeleteBlob(containerName, blobName, (err: any) => {
        err ? reject(err) : resolve();
      });
    });
  }
}
