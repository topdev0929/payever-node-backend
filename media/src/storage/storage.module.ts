import * as AzureStorage from 'azure-storage';
import { Module } from '@nestjs/common';
import { BlobStorageService } from './services';
import { environment } from '../environments';
import { CompressorModule } from '../compressor';
import {
  CreateContainerCommand,
  RestoreMediaCommand,
} from './commands';
import { AdminContainersController } from './controllers';

@Module({
  controllers: [
    AdminContainersController,
  ],
  exports: [
    BlobStorageService,
  ],
  imports: [
    CompressorModule,
  ],
  providers: [
    {
      provide: AzureStorage.BlobService,
      useValue: AzureStorage.createBlobService(
        environment.storage_account_name,
        environment.storage_key,
      ),
    },
    BlobStorageService,
    CreateContainerCommand,
    RestoreMediaCommand,
  ],
})
export class StorageModule { }
