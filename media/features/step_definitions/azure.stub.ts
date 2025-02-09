import * as streamModule from 'stream';
import { INestApplication, Logger } from '@nestjs/common';
import { TestingModuleBuilder } from '@nestjs/testing';
import { CucumberOptionsInterface, ProviderInterface } from '@pe/cucumber-sdk';
import { ITestStepHookParameter } from '@cucumber/cucumber';
import * as azurestorage from 'azure-storage';
import BlobService = azurestorage.services.blob.blobservice.BlobService;
import SpeedSummary = azurestorage.common.streams.speedsummary.SpeedSummary;
import { MimeTypesEnum } from '../../src/tools/mime-types.enum';
import { createReadStream } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import * as uuid from 'uuid';


// tslint:disable-next-line: typedef
const pipelineAsync = promisify(streamModule.pipeline);

export const AZURE_STUB_NAME: string = 'AZURE_STUB';

export class AzureStub implements ProviderInterface {
  private blobs: { [key: string]: string } = { };

  public constructor(protected options: CucumberOptionsInterface) { }

  public async configure(
    builder: TestingModuleBuilder,
    scenario: ITestStepHookParameter,
  ): Promise<void> {
    builder.overrideProvider(azurestorage.BlobService).useValue(this);
  }

  public createBlockBlobFromStream(
    container: string,
    blob: string,
    stream: streamModule.Readable,
    streamLength: number,
    options: BlobService.CreateBlockBlobRequestOptions,
    callback: azurestorage.ErrorOrResult<BlobService.BlobResult>,
  ): SpeedSummary {
    let content: string = '';
    stream.on('data', (chunk: any) => {
      content += chunk.toString();
    });

    const blobs: any = this.blobs;
    stream.on('end', () => {
      blobs[blob] = content;
      callback(null, null, null);
    });

    return { } as SpeedSummary;
  }

  public getBlobProperties(
    container: string,
    blobName: string,
    callback: azurestorage.ErrorOrResult<BlobService.BlobResult>,
  ): void {
    callback(
      null,
      {
        contentSettings: {
          contentType: MimeTypesEnum.MP4,
        },
      } as azurestorage.BlobService.BlobResult,
      null,
    );
  }

  public async getBlobToStream(
    container: string,
    blobName: string,
    targetStream: NodeJS.WritableStream,
    callback: azurestorage.ErrorOrResult<BlobService.BlobResult>,
  ): Promise<void> {
    try {
      await pipelineAsync(
        createReadStream(
          join(
            'features',
            'data',
            'test.mp4',
          ),
        ),
        targetStream,
      );
      callback(null, null, null);
    } catch (e) {
      callback(e, null, null);
    }
  }

  public deleteBlob(
    container: string,
    blob: string,
    callback: azurestorage.ErrorOrResult<BlobService.BlobResult>,
  ): void {    
    callback(null, null, null);
  }

  public async setup(application: INestApplication, logger: Logger): Promise<void> { }

  public async close(): Promise<void> {
  }

  public deleteContainer(
    containerName: string,
    options: any,
    callback: any,
  ): void {    
    callback(null, null);
  }

  public doesContainerExist(
    containerName: string,    
    callback: any,
  ): void {
    callback(null, { exists: containerName === 'existing-container' });
  }


  public listContainersSegmented(    
    continuationToken: string,
    callback: any,
  ): void {
    callback(null, {
      continuationToken,
      entries: [
        {
          name: 'sample-container',
        },
      ],      
    });
  }


  public createContainer(
    containerName: string,
    options: any,
    callback: any,
  ): void {
    callback(null, { name: containerName, etag: uuid.v4() });
  }

  public getContainerProperties(
    containerName: string,
    options: any,
    callback: any,
  ): void {
    callback(null, { name: containerName, etag: uuid.v4() });
  }

  public getBlob(blob: string): string {
    return this.blobs[blob];
  }

  public getName(): string {
    return AZURE_STUB_NAME;
  }
}
