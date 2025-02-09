import { HttpModule, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelMongooseModels } from '@pe/channels-sdk';
import { CommonModelsNamesEnum, CommonSdkModule } from '@pe/common-sdk';
import { MediaSdkModule } from '@pe/media-sdk';
import { BusinessSchema } from '../business/schemas';
import { CheckAssignedImagesCommand } from '../commands';
import { environment } from '../environments';
import {
  BlogAccessConfigSchemaName,
  BlogPageSchemaName,
  BlogSchemaName,
  BusinessSchemaName,
  DomainSchemaName,
} from '../mongoose-schema/mongoose-schema.names';
import { BlogEsExportCommand, BlogExportCommand, DeleteInactiveBlogCommand } from './commands';
import {
  BlogAccessController,
  BlogController,
  BlogPageController,
  CommonController,
  DomainController,
  AdminController,
} from './controllers';
import { BlogEventsListener, BlogMediaEventsListener, BusinessListener } from './event-listeners';
import { BlogRabbitEventsProducer, EventApplicationProducer } from './producers';
import { BlogAccessConfigSchema, BlogPageSchema, BlogSchema, DomainSchema } from './schemas';
import {
  BlogAccessConfigService,
  BlogElasticService,
  BlogPageService,
  BlogService,
  CommonService,
  DomainService,
  OnPublishConsumerService,
  PopulatorService,
} from './services';
import { BlogEditVoter } from './voters';
import { MessageBusChannelsEnum } from './enums';
import { BusinessModuleLocal } from '../business';
import { BuilderMessagesConsumer, DeleteNonInternalBusinessConsumer, ElasticConsumer } from './consumers';

@Module({
  controllers: [
    DomainController,
    BlogAccessController,
    BlogController,
    CommonController,
    BuilderMessagesConsumer,
    BlogPageController,
    AdminController,
    DeleteNonInternalBusinessConsumer,
    ElasticConsumer,
  ],
  exports: [
    BlogAccessConfigService,
    BlogService,
    BlogPageService,
    DomainService,
    MongooseModule,
  ],
  imports: [
    Logger,
    HttpModule,
    BusinessModuleLocal,
    MongooseModule.forFeature([
      ...ChannelMongooseModels,
      { name: BusinessSchemaName, schema: BusinessSchema },
      { name: BlogAccessConfigSchemaName, schema: BlogAccessConfigSchema },
      { name: BlogSchemaName, schema: BlogSchema },
      { name: BlogPageSchemaName, schema: BlogPageSchema },
      { name: DomainSchemaName, schema: DomainSchema },

    ]),
    MediaSdkModule,
    CommonSdkModule.forRoot({
      channel: MessageBusChannelsEnum.blog,
      consumerModels: [CommonModelsNamesEnum.LanguageModel],
      rsaPath: environment.rsa,
    }),
  ],
  providers: [
    BlogEsExportCommand,
    BlogExportCommand,
    CheckAssignedImagesCommand,
    DeleteInactiveBlogCommand,
    BlogEventsListener,
    BusinessListener,
    BlogMediaEventsListener,
    BlogRabbitEventsProducer,
    EventApplicationProducer,
    BlogService,
    BlogElasticService,
    BlogAccessConfigService,
    BlogEditVoter,
    DomainService,
    CommonService,
    PopulatorService,
    OnPublishConsumerService,
    BlogPageService,
  ],
})
export class BlogModule { }
