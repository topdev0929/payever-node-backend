import { HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventDispatcherModule, MutexModule } from '@pe/nest-kit';
import {
  DropboxDownloadCron,
  DropboxMiningCron,
  ImageAssessmentTaskCron,
  VideoGeneratorTaskCron,
} from '../cron-handler';
import {
  AttributeSchema,
  AttributeSchemaName,
  CounterSchema,
  CounterSchemaName,
  DropboxMediaSchema,
  DropboxMediaSchemaName,
  ExcelMediaSchema,
  ExcelMediaSchemaName,
  GeneratedVideoSchema,
  GeneratedVideoSchemaName,
  ImageAssessmentSchema,
  ImageAssessmentSchemaName,
  ImageAssessmentTaskSchema,
  ImageAssessmentTaskSchemaName,
  MediaAttributeSchema,
  MediaAttributeSchemaName,
  MediaInfoSchema,
  MediaInfoSchemaName,
  MediaInfoTaskSchema,
  MediaInfoTaskSchemaName,
  SceneInfoSchema,
  SceneInfoSchemaName,
  SubscriptionMediaSchema,
  SubscriptionMediaSchemaName,
  UserAlbumSchema,
  UserAlbumSchemaName,
  UserAttributeGroupSchema,
  UserAttributeGroupSchemaName,
  UserAttributeSchema,
  UserAttributeSchemaName,
  UserMediaAttributeSchema,
  UserMediaAttributeSchemaName,
  UserMediaSchema,
  UserMediaSchemaName,
  VideoGeneratorTaskSchema,
  VideoGeneratorTaskSchemaName,
  VideoInfoSchema,
  VideoInfoSchemaName,
} from '../schemas';
import {
  AttributeService,
  CounterService,
  DropboxService,
  ImageAssessmentService,
  ImageAssessmentTaskProcessorService,
  ImageAssessmentTaskService, MediaInfoTaskService,
  MediaUploadService,
  ObjectDetectionService, QueryBuilderService,
  SceneInfoService, UserAttributeGroupService, UserAttributeService,
  UserMediaService,
  VideoGeneratorService,
  VideoGeneratorTaskProcessorService,
  VideoGeneratorTaskService,
  VideoInfoService,
} from '../services';
import { FolderSchema, FolderSchemaName } from '@pe/folders-plugin';
import * as dotenv from 'dotenv';
import {
  FrameGeneratorStrategy,
  RandomVideoGeneratorStrategy,
  VideoGeneratorByTagStrategy,
} from '../strategies/task/video-generator';
import { BusinessMediaMessagesProducer, VideoGeneratorMessagesProducer } from '../producers';
import { BusinessModule } from '../../business/business.module';
import { CollectorModule } from '@pe/nest-kit/modules/collector-pattern';

dotenv.config();

export const cronLoader: any = {
  controllers: [
  ],
  exports: [
  ],
  imports: [
    HttpModule,
    MutexModule,
    // CollectorModule,
    // BusinessModule,
    // EventDispatcherModule,
    MongooseModule.forFeature([
      { name: SubscriptionMediaSchemaName, schema: SubscriptionMediaSchema },
      { name: AttributeSchemaName, schema: AttributeSchema },
      { name: MediaAttributeSchemaName, schema: MediaAttributeSchema },
      { name: ImageAssessmentSchemaName, schema: ImageAssessmentSchema },

      { name: UserMediaSchemaName, schema: UserMediaSchema },
      { name: UserAttributeSchemaName, schema: UserAttributeSchema },
      { name: UserMediaAttributeSchemaName, schema: UserMediaAttributeSchema },

      { name: VideoInfoSchemaName, schema: VideoInfoSchema },
      { name: SceneInfoSchemaName, schema: SceneInfoSchema },
      { name: GeneratedVideoSchemaName, schema: GeneratedVideoSchema },
      { name: VideoGeneratorTaskSchemaName, schema: VideoGeneratorTaskSchema },
      { name: ImageAssessmentTaskSchemaName, schema: ImageAssessmentTaskSchema },
      { name: UserAlbumSchemaName, schema: UserAlbumSchema },
      { name: MediaInfoTaskSchemaName, schema: MediaInfoTaskSchema },
      { name: MediaInfoSchemaName, schema: MediaInfoSchema },
      { name: UserAttributeSchemaName, schema: UserAttributeSchema },
      { name: UserAttributeGroupSchemaName, schema: UserAttributeGroupSchema },
      { name: UserMediaAttributeSchemaName, schema: UserMediaAttributeSchema },
      { name: FolderSchemaName, schema: FolderSchema, collection: 'folders' },

      { name: DropboxMediaSchemaName, schema: DropboxMediaSchema },
      { name: ExcelMediaSchemaName, schema: ExcelMediaSchema },

      { name: CounterSchemaName, schema: CounterSchema },
    ]),
  ],
  providers: [
    // todo: move nima to other pod first
    // ImageAssessmentTaskCron,
    // ImageAssessmentService,
    // ImageAssessmentTaskService,
    // ImageAssessmentTaskProcessorService,

    // video generator
    // VideoGeneratorTaskCron,
    // VideoGeneratorTaskProcessorService,
    // VideoGeneratorTaskService,
    // FrameGeneratorStrategy,
    // RandomVideoGeneratorStrategy,
    // VideoGeneratorByTagStrategy,
    // VideoInfoService,
    // SceneInfoService,
    // VideoGeneratorService,
    // VideoGeneratorMessagesProducer,
    // ObjectDetectionService,
    // MediaUploadService,
    // UserMediaService,
    // MediaInfoTaskService,
    // BusinessMediaMessagesProducer,
    // UserAttributeService,
    // CounterService,
    // QueryBuilderService,
    // UserAttributeGroupService,
    // AttributeService,

    // dropbox
    DropboxMiningCron,
    DropboxDownloadCron,
    DropboxService,
  ],
};
