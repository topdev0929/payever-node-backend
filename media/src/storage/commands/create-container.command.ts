import * as AzureStorage from 'azure-storage';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit/modules/command';
import { MediaContainersEnum } from '@pe/media-sdk';
import { Positional } from '@pe/nest-kit';

@Injectable()
export class CreateContainerCommand {
  @Inject() private blobService: AzureStorage.BlobService;
  @Inject() private readonly logger: Logger;

  @Command({ command: 'media:create-container <containerName>', describe: 'Restores removed images at container' })
  public async restoreMedia(
    @Positional({ name: 'containerName' }) containerName: MediaContainersEnum,
  ): Promise<void> {

    // tslint:disable-next-line: typedef
    await new Promise<void>((resolve, _reject) => {
      this.blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, () => {
        resolve();
      });
    });

    this.logger.log(`Container "${containerName}" created`);
  }
}
