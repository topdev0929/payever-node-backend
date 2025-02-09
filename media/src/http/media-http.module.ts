import { Module } from '@nestjs/common';
import { StorageError } from 'azure-storage/lib/common/errors/errors';

import {
  ErrorsHandlerModule,
} from '@pe/nest-kit';

import { CompressorNotFoundException } from '../compressor/exceptions';
import { MediaModule } from '../media';
import { ValidationFailedException } from '../media/exceptions';
import { StorageModule } from '../storage';

import {
  ImagesController,
  StorageController,
  UserController,
  FileController,
  VideoController,
  AdminFilesController,
  AdminMimeTypesController,
} from './controllers';
import { MultipartService } from './services';
import { AzureErrorHandler } from './error-handlers';

@Module({
  controllers: [
    StorageController,
    ImagesController,
    VideoController,
    FileController,
    UserController,
    AdminFilesController,
    AdminMimeTypesController,
  ],
  imports: [
    ErrorsHandlerModule.forRoot([
      {
        exceptions: [ValidationFailedException, CompressorNotFoundException],
        name: 'dto-validation',
      },
      {
        exceptions: [StorageError],
        name: 'azure-error',
      },
    ]),
    StorageModule,
    MediaModule,
  ],
  providers: [
    MultipartService,
    AzureErrorHandler,
  ],
})
export class MediaHttpModule { }
