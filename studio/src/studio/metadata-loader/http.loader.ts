import { HttpModule } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { EventDispatcherModule, MutexModule } from '@pe/nest-kit';
import { CollectorModule } from '@pe/nest-kit/modules/collector-pattern';
import { SampleDataModule } from '../../sample-data/sample-data.module';
import { ElasticSearchModule } from '@pe/elastic-kit/module';
import {
  AdminSubscriptionMediaController,
  AttributeController,
  DropboxController,
  FrameVideoGeneratorController,
  MediaStreamController,
  RandomVideoGeneratorController,
  SceneInfoController,
  UserAlbumController,
  UserAttributeController,
  UserAttributeGroupController,
  UserMediaController,
  UserMediasController,
  UserSubscriptionMediaController,
  IntegrationController,
} from '../controllers';
import {
  BusinessMediaMessagesProducer,
  StudioMediasUploadedMessagesProducer,
  SubscriptionMediaMessagesProducer,
} from '../producers';
import {
  BusinessCreatedEventsListener,
  BusinessRemovedEventsListener,
  DorpboxDownloadTriggerListener,
  DorpboxMiningTriggerListener,
  DropboxExcelTriggerListener,
  DropboxSetAttributeTriggerListener,
  SubscriptionMediaCompressTriggerListener,
  UserMediaCreatedEventsListener,
} from '../event-listeners';
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
  ElasticService,
  ImageAssessmentTaskService,
  MediaInfoService,
  MediaInfoTaskService,
  MediaStreamService,
  MediaUploadService,
  ObjectDetectionService,
  QueryBuilderEsService,
  QueryBuilderService,
  SampleGeneratorService,
  SceneInfoService,
  StudioMediasUploadedService,
  SubscriptionMediaService,
  UserAlbumService,
  UserAttributeGroupService,
  UserAttributeService,
  UserMediaService,
  VideoGeneratorTaskService,
} from '../services';
import { ImageStreamStrategy, VideoStreamStrategy } from '../strategies';
import {
  UserAlbumCreateVoter,
  UserAlbumReadVoter,
  UserAlbumRemoveVoter,
  UserAlbumUpdateVoter,
  UserAttributeCreateVoter,
  UserAttributeGroupCreateVoter,
  UserAttributeGroupReadVoter,
  UserAttributeGroupRemoveVoter,
  UserAttributeGroupUpdateVoter,
  UserAttributeReadVoter,
  UserAttributeRemoveVoter,
  UserAttributeUpdateVoter,
  UserMediaCreateVoter,
  UserMediaReadVoter,
  UserMediaRemoveVoter,
  UserMediasRemoveVoter,
  UserMediasUpdateVoter,
  UserMediaUpdateVoter,
  UserSubscriptionMediaReadVoter,
} from '../voters';
import {
  AlbumExistsConstraint,
  UniqueAlbumNameConstraint,
  UserAttributeGroupsBusinessConstraint,
  UserAttributesBusinessConstraint,
} from '../constraints';
import { BusinessModule } from '../../business/business.module';
import {
  ImageSubscriptionMediaInfoStrategy,
  ImageUserMediaInfoStrategy,
  VideoSubscriptionMediaInfoStrategy,
  VideoUserMediaInfoStrategy,
} from '../strategies/media-info';
import { MediaInfoTaskProcessorService } from '../services/media-info-task-processor.service';
import { FolderSchema, FolderSchemaName, FoldersPluginModule } from '@pe/folders-plugin';
import { RulesSdkModule } from '@pe/rules-sdk';
import { environment } from '../../environments';
import {
  CreateDefaultAlbumCommand,
  SubscriptionMediaEsExportCommand,
  SubscriptionMediaEsSetupCommand,
} from '../commands';
import { FoldersConfig, RulesOptions } from '../configs';
import * as dotenv from 'dotenv';
import { 
  AdminMediaStreamsController, 
  AdminUserAttributeGroupsController, 
  AdminUserAttributesController, 
  AdminUserMediasController, 
} from '../controllers/admin';

dotenv.config();

export const httpLoader: any = {
  controllers: [
    AttributeController,
    UserSubscriptionMediaController,
    UserMediaController,
    UserMediasController,
    MediaStreamController,
    UserAlbumController,
    UserAttributeGroupController,
    UserAttributeController,

    DropboxController,
    IntegrationController,

    // todo: move video generator outside http pods
    // video generator
    // FrameVideoGeneratorController,
    // RandomVideoGeneratorController,
    // SceneInfoController,

    // Admin Controllers
    AdminSubscriptionMediaController,
    AdminMediaStreamsController,
    AdminUserAttributeGroupsController,
    AdminUserAttributesController,
    AdminUserMediasController,
  ],
  exports: [
    UserAlbumService,
  ],
  imports: [
    HttpModule,
    CollectorModule,
    HttpAdapterHost,
    MutexModule,
    SampleDataModule,
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
    UserSubscriptionMediaReadVoter,
    SubscriptionMediaMessagesProducer,

    UserMediaCreateVoter,
    UserMediaUpdateVoter,
    UserMediaReadVoter,
    UserMediaRemoveVoter,
    UserMediasUpdateVoter,
    UserMediasRemoveVoter,

    SubscriptionMediaService,
    UserMediaService,
    MediaStreamService,
    ImageStreamStrategy,
    VideoStreamStrategy,
    MediaUploadService,

    AlbumExistsConstraint,
    UniqueAlbumNameConstraint,
    UserAlbumService,
    UserAlbumReadVoter,
    UserAlbumCreateVoter,
    UserAlbumUpdateVoter,
    UserAlbumRemoveVoter,
    BusinessCreatedEventsListener,
    BusinessRemovedEventsListener,
    UserMediaCreatedEventsListener,
    SampleGeneratorService,

    MediaInfoTaskService,
    MediaInfoTaskProcessorService,

    ImageUserMediaInfoStrategy,
    ImageSubscriptionMediaInfoStrategy,
    VideoUserMediaInfoStrategy,
    VideoSubscriptionMediaInfoStrategy,
    MediaInfoService,

    UserAttributeService,
    UserAttributeGroupService,
    UserAttributeCreateVoter,
    UserAttributeReadVoter,
    UserAttributeUpdateVoter,
    UserAttributeRemoveVoter,
    UserAttributeGroupCreateVoter,
    UserAttributeGroupUpdateVoter,
    UserAttributeGroupReadVoter,
    UserAttributeGroupRemoveVoter,
    UserAttributesBusinessConstraint,
    UserAttributeGroupsBusinessConstraint,
    BusinessMediaMessagesProducer,
    StudioMediasUploadedService,

    SubscriptionMediaCompressTriggerListener,

    CounterService,

    ElasticService,

    QueryBuilderEsService,
    QueryBuilderService,

    DropboxService,
    DorpboxMiningTriggerListener,
    DorpboxDownloadTriggerListener,
    DropboxExcelTriggerListener,
    DropboxSetAttributeTriggerListener,

    SubscriptionMediaEsSetupCommand,
    SubscriptionMediaEsExportCommand,
    CreateDefaultAlbumCommand,

    ImageAssessmentTaskService,

    // todo: move video generator outside http pods
    // video generator
    // VideoGeneratorService,
    // VideoGeneratorTaskProcessorService,
    // VideoGeneratorMessagesProducer,
    // FrameGeneratorStrategy,
    // RandomVideoGeneratorStrategy,
    // VideoGeneratorByTagStrategy,
    // VideoInfoService,
    // VideoGeneratorTaskService,

    // ObjectDetectionService,
    // SceneInfoService,
  ],
};
