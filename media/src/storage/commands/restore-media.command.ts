import { Injectable, Inject, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit/modules/command';
import { sync } from 'mime-kind';
import * as AzureStorage from 'azure-storage';
import { MediaContainersEnum } from '@pe/media-sdk';
import { Positional } from '@pe/nest-kit';
import ListBlobsResult = AzureStorage.services.blob.blobservice.BlobService.ListBlobsResult;
import BlobResult = AzureStorage.services.blob.blobservice.BlobService.BlobResult;
import { BlobStorageService } from '../services';

@Injectable()
export class RestoreMediaCommand {
  @Inject() private readonly blobStorageService: BlobStorageService;

  @Command({ command: 'media:restore <containerName>', describe: 'Restores removed images at container' })
  public async restoreMedia(
    @Positional({ name: 'containerName' }) containerName: MediaContainersEnum,
  ): Promise<void> {

    let token: any = null;
    while (true) {
      const list: ListBlobsResult = await this.blobStorageService.getList(containerName, token);

      await this.blobStorageService.restoreRemoved(containerName, list.entries);

      token = list.continuationToken;
      if (!token || list.entries.length === 0) {
        break;
      }
    }
  }
}
