import { HttpModule, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChannelMongooseModels } from '@pe/channels-sdk';
import { CommonModelsNamesEnum, CommonSdkModule } from '@pe/common-sdk';
import { MediaSdkModule } from '@pe/media-sdk';
import { CronModule } from '@pe/cron-kit';
import { BusinessModule } from '../business';
import { BusinessSchema } from '../business/schemas';
import { CheckAssignedImagesCommand, ExportChannelSets } from '../commands';
import {
  BusinessSchemaName,
  TerminalAccessConfigSchemaName,
  TerminalSchemaName,
} from '../mongoose-schema/mongoose-schema.names';
import {
  MigrateThemesCommand,
  TerminalExportCommand,
  TerminalEsExportCommand,
  ForceInstallDefaultThemeCommand,
  DeleteInactiveTerminalCommand,
} from './commands';
import { BuilderMessagesConsumer, DeleteNonInternalBusinessConsumer } from './consumers';
import {
  AdminController,
  DomainController,
  MailerReportMessageBusController,
  TerminalAccessController,
  TerminalController,
} from './controllers';
import {
  NotificationsManagementListener,
  TerminalEventsListener,
  TerminalMediaEventsListener,
  UpdateChannelSetForBusinessListener,
} from './event-listeners';
import {
  EventApplicationProducer,
  ForceInstallTerminalProducer,
  ReportDataEventProducer,
  TerminalRabbitEventsProducer,
} from './producers';
import { TerminalAccessConfigSchema, TerminalSchema } from './schemas';
import {
  OnPublishConsumerService,
  TerminalAccessConfigService,
  TerminalElasticService,
  TerminalService,
} from './services';
import { PosNotifier } from './notifiers';
import { TerminalEditVoter } from './voters';
import { ForceInstallCron } from './cron-handlers';
import { environment } from '../environments';
import { MessageBusChannelsEnum } from './enums';

@Module({
  controllers: [
    AdminController,
    DomainController,
    MailerReportMessageBusController,
    TerminalAccessController,
    TerminalController,
    BuilderMessagesConsumer,
    DeleteNonInternalBusinessConsumer,
  ],
  exports: [TerminalAccessConfigService, TerminalService],
  imports: [
    Logger,
    HttpModule,
    BusinessModule,
    MongooseModule.forFeature([
      ...ChannelMongooseModels,
      { name: BusinessSchemaName, schema: BusinessSchema },
      { name: TerminalAccessConfigSchemaName, schema: TerminalAccessConfigSchema },
      { name: TerminalSchemaName, schema: TerminalSchema },
    ]),
    MediaSdkModule,
    CommonSdkModule.forRoot({
      channel: MessageBusChannelsEnum.pos,
      consumerModels: [CommonModelsNamesEnum.LanguageModel],
      rsaPath: environment.rsa,
    }),
    CronModule,
  ],
  providers: [
    // Commands
    CheckAssignedImagesCommand,
    ForceInstallDefaultThemeCommand,
    MigrateThemesCommand,
    TerminalEsExportCommand,
    TerminalExportCommand,
    DeleteInactiveTerminalCommand,
    ExportChannelSets,
    // Listeners
    NotificationsManagementListener,
    TerminalEventsListener,
    TerminalMediaEventsListener,
    UpdateChannelSetForBusinessListener,
    // Producers
    TerminalRabbitEventsProducer,
    ForceInstallTerminalProducer,
    EventApplicationProducer,
    ReportDataEventProducer,
    // Services
    TerminalService,
    TerminalAccessConfigService,
    TerminalElasticService,
    OnPublishConsumerService,
    // Other
    PosNotifier,
    ForceInstallCron,
    TerminalEditVoter,
  ],
})
export class TerminalModule { }
