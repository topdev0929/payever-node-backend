import { HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventDispatcherModule } from '@pe/nest-kit';
import { ElasticSearchModule } from '@pe/elastic-kit/module';
import { MediaServiceBusController } from '../controllers';
import {
  BusinessMediaMessagesProducer,
  StudioMediasUploadedMessagesProducer,
  SubscriptionMediaMessagesProducer,
} from '../producers';
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
  QueryBuilderEsService,
  QueryBuilderService,
  StudioMediasUploadedService,
  SubscriptionMediaService, UserAlbumService,
  UserAttributeGroupService,
  UserAttributeService,
  UserMediaService,
} from '../services';
import { BusinessModule } from '../../business/business.module';
import { FolderSchema, FolderSchemaName, FoldersPluginModule } from '@pe/folders-plugin';
import { environment } from '../../environments';
import * as dotenv from 'dotenv';
import { FoldersConfig, RulesOptions } from '../configs';
import { RulesSdkModule } from '@pe/rules-sdk';

dotenv.config();

export const consumerLoader: any = {
  controllers: [
    MediaServiceBusController,
  ],
  exports: [
    UserAlbumService,
  ],
  imports: [
    HttpModule,
    BusinessModule,
    EventDispatcherModule,
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
    ElasticSearchModule.forRoot({
      authPassword: environment.elastic.elasticSearchAuthPassword,
      authUsername: environment.elastic.elasticSearchAuthUsername,
      cloudId: environment.elastic.elasticSearchCloudId,
      host: environment.elastic.elasticSearch,
    }),
    FoldersPluginModule.forFeature(FoldersConfig),
    RulesSdkModule.forRoot(RulesOptions),
  ],
  providers: [
    StudioMediasUploadedMessagesProducer,
    AttributeService,
    SubscriptionMediaService,
    UserMediaService,
    MediaUploadService,
    MediaInfoTaskService,
    UserAttributeService,
    UserAttributeGroupService,
    BusinessMediaMessagesProducer,
    StudioMediasUploadedService,
    CounterService,
    QueryBuilderEsService,
    QueryBuilderService,
    SubscriptionMediaMessagesProducer,

    ImageAssessmentTaskService,

    UserAlbumService,
  ],
};
