import { HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessMediaMessagesProducer, SubscriptionMediaMessagesProducer } from '../producers';
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
  ImageAssessmentTaskService,
  MediaInfoTaskService,
  MediaUploadService,
  QueryBuilderService,
  UserAlbumService,
  UserAttributeGroupService,
  UserAttributeService,
  UserMediaService,
} from '../services';
import { BusinessModule } from '../../business/business.module';
import { FolderSchema, FolderSchemaName } from '@pe/folders-plugin';
import * as dotenv from 'dotenv';

dotenv.config();

export const wsLoader: any = {
  controllers: [
  ],
  exports: [
    UserAlbumService,
  ],
  imports: [
    HttpModule,
    BusinessModule,
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
    AttributeService,
    UserMediaService,
    MediaUploadService,
    UserAlbumService,
    MediaInfoTaskService,
    UserAttributeService,
    UserAttributeGroupService,
    BusinessMediaMessagesProducer,
    CounterService,
    QueryBuilderService,
    SubscriptionMediaMessagesProducer,

    ImageAssessmentTaskService,
  ],
};
