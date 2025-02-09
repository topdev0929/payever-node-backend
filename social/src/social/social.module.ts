import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FoldersPluginModule } from '@pe/folders-plugin';

import { BusinessSchema, BusinessSchemaName } from '../business/schemas';
import { BusinessLocalService } from '../business/services';
import { ChannelSetModule } from '../channel-set/channel-set.module';
import { IntegrationModule } from '../integration/integration.module';
import { ChannelRulesController, PostsController } from './controller';
import { PostSchema, PostSchemaName } from './schemas';
import { MediaUploaderService, PostsService } from './services';
import { InnerEventProducer } from './producers';
import { ThirdpartyRulesModule } from '@pe/third-party-rules-sdk';
import { AppNamesEnum, AppTypeEnum } from '@pe/third-party-rules-sdk/module/enums';
import { MultipartService } from './services/multipart.service';
import { EventDispatcherModule, IntercomModule } from '@pe/nest-kit';
import { ImageProcessor, MediaServiceClient } from './services/media-uploader';
import { VideoPostEventsListener } from './event-listeners';
import { RulesSdkModule } from '@pe/rules-sdk';
import { RulesOptions, FoldersConfig } from './config';
import { RabbitChannelsEnum } from '../common';
import { PostsExportCommand } from './commands';
import { PostStateConsumer } from './consumers';

@Module({
  controllers: [
    ChannelRulesController,
    PostStateConsumer,
    PostsController,
  ],
  exports: [
    PostsService,
  ],
  imports: [
    HttpModule,
    IntegrationModule,
    ChannelSetModule,
    EventDispatcherModule,
    MongooseModule.forFeature(
      [
        { name: BusinessSchemaName, schema: BusinessSchema },
        { name: PostSchemaName, schema: PostSchema },
      ],
    ),
    FoldersPluginModule.forFeature(FoldersConfig),
    RulesSdkModule.forRoot(RulesOptions),
    ThirdpartyRulesModule.forRoot(
      {
        app: AppNamesEnum.SocialApp,
        appType: AppTypeEnum.ConsumerApp,
        channel: RabbitChannelsEnum.Social,
      },
    ),
    IntercomModule,
  ],
  providers: [
    PostsExportCommand,
    BusinessLocalService,
    PostsService,
    MultipartService,
    ImageProcessor,
    MediaServiceClient,
    InnerEventProducer,
    VideoPostEventsListener,
    MediaUploaderService,
  ],
})
export class SocialModule { }
