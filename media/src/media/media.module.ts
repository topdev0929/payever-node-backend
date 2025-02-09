import { HttpModule, Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaContainersEnum } from '@pe/media-sdk';
import { CollectorModule } from '@pe/nest-kit';
import { BusinessModule } from '@pe/business-kit';
import { environment } from '../environments';
import { GenerateWallpapersCommand, RemoveUnusedImagesCommand } from './commands';
import { MediaBusMessageConsumer } from './consumers';
import { UnassignedMediaRemoverCron } from './cron';
import { MessageBusChannelsEnum } from './enums';
import {
  BusinessSchema,
  DataSchema,
  DataSchemaName,
  MediaItemRelationSchema,
  MediaItemSchema,
  MediaItemSchemaName,
  MimeTypeSchema,
  MimeTypeSchemaName,
  UserSchema,
} from './schemas';
import {
  BusinessMediaService,
  DbStorageService,
  ImagesStorage,
  MediaItemService,
  MediaResizeResolver,
  RestrictedMediaResolver,
  UserMediaService,
  VideoStorageService,
  GenerateThumbnailService,
  FilesStorage,
  MimeTypeService,
} from './services';
import { CompressorModule } from '../compressor';
import { StorageModule } from '../storage';
import { FileDownloaderService } from './services/file-downloader.service';
import { MediaThumbnailGeneratorWrapper, ImageThumbnailGenerator } from './services/thumbnail-generator';
import { VideoThumbnailGenerator } from './services/thumbnail-generator/implementations/video-thumbnail-generator';

const restrictedMediaResolver: RestrictedMediaResolver = new RestrictedMediaResolver();
restrictedMediaResolver.setRestrictedMediaList(
  MediaContainersEnum.Wallpapers,
  environment.restrictedWallpapersMediaList,
);
const restrictedMediaResolverProvider: Provider = {
  provide: RestrictedMediaResolver,
  useValue: restrictedMediaResolver,
};

@Module({
  controllers: [
    MediaBusMessageConsumer,
  ],
  exports: [
    BusinessMediaService,
    ImagesStorage,
    MediaItemService,
    UserMediaService,
    FilesStorage,
    DbStorageService,
    GenerateThumbnailService,
    VideoStorageService,
    MimeTypeService,
    FileDownloaderService,
  ],
  imports: [
    HttpModule,
    BusinessModule.forRoot({
      customSchema: BusinessSchema,
      rabbitChannel: MessageBusChannelsEnum.media,
    }),
    MongooseModule.forFeature([
      { name: 'Business', schema: BusinessSchema },
      { name: 'User', schema: UserSchema },
      { name: DataSchemaName, schema: DataSchema },
      { name: MediaItemSchemaName, schema: MediaItemSchema },
      { name: 'MediaItemRelation', schema: MediaItemRelationSchema },
      { name: MimeTypeSchemaName, schema: MimeTypeSchema },
    ]),
    CollectorModule,
    CompressorModule,
    StorageModule,
  ],
  providers: [
    ImagesStorage,
    FilesStorage,
    GenerateWallpapersCommand,
    RemoveUnusedImagesCommand,
    BusinessMediaService,
    UserMediaService,
    DbStorageService,
    UnassignedMediaRemoverCron,
    restrictedMediaResolverProvider,
    MediaItemService,
    MediaResizeResolver,
    VideoStorageService,
    GenerateThumbnailService,
    MimeTypeService,
    FileDownloaderService,
    MediaThumbnailGeneratorWrapper,
    ImageThumbnailGenerator,
    VideoThumbnailGenerator,
  ],
})
export class MediaModule { }
