import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventDispatcherModule, RabbitMqModule } from '@pe/nest-kit';
import { NotificationsSdkModule } from '@pe/notifications-sdk';
import { BusinessModule, BusinessService } from '@pe/business-kit';
import { FoldersPluginModule } from '@pe/folders-plugin';

import { BusinessSchema } from '../business';
import {
  ExportIntegrationCommand,
  ExportIntegrationSubscriptions,
  IntegrationEsExportCommand,
  ReindexAllowedBusinessesCommand,
  ReindexExcludedIntegrationsCommand,
} from './commands';
import { SetupDefaultCategoriesCommand } from './commands/setup-default-categories.command';
import { FoldersConfig, MongooseSchemas } from './config';
import { IntegrationsBusinessConstraint } from './constraints';
import {
  AppsBusMessageController,
  AutoDiscoveryConsumer,
  IntegrationSubscriptionConsumer,
  IntegrationSyncConsumer,
} from './consumers';
import {
  AdminController,
  IntegrationController,
  IntegrationSubscriptionBusMessageController,
  IntegrationSubscriptionController,
  AdminIntegrationSubscriptionsController,
  AdminIntegrationsController,
  AdminCategoriesController,
  AdminBusinessesController,
  IntegrationWrapperSubscriptionController,
  IntegrationWrapperController,
} from './controllers';
import { FolderDocumentsListener, IntegrationListener, IntegrationSubscriptionListener } from './listener';
import { EventProducer, IntegrationEventProducer, IntegrationSubscriptionEventProducer } from './producer';
import {
  BusinessServiceLocal,
  CategoryService,
  IntegrationService,
  IntegrationSubscriptionService,
  IntegrationWrapperSubscriptionService,
} from './services';
import { environment, RabbitChannelEnum } from '../environments';
import { TranslationsSdkModule } from '@pe/translations-sdk';
import { SupportedLocalesEnum } from '@pe/translations-sdk/module/enums';

@Module({
  controllers: [
    // Consumers
    IntegrationSubscriptionConsumer,
    AutoDiscoveryConsumer,
    IntegrationSyncConsumer,
    AppsBusMessageController,
    // Controllers
    AdminBusinessesController,
    AdminController,
    AdminCategoriesController,
    AdminIntegrationsController,
    AdminIntegrationSubscriptionsController,
    IntegrationController,
    IntegrationSubscriptionBusMessageController,
    IntegrationSubscriptionController,
    IntegrationWrapperController,
    IntegrationWrapperSubscriptionController,
  ],
  exports: [
    BusinessService,
    IntegrationService,
    IntegrationSubscriptionService,
    IntegrationWrapperSubscriptionService,
  ],
  imports: [
    HttpModule,
    NotificationsSdkModule,
    EventDispatcherModule,
    MongooseModule.forFeature(MongooseSchemas),
    RabbitMqModule.forRoot(environment.rabbitmq),
    BusinessModule.forRoot({
      customSchema: BusinessSchema,
      rabbitChannel: RabbitChannelEnum.connect,
      useRPCCreatedMessage: true,
    }),
    FoldersPluginModule.forFeature(FoldersConfig),
    TranslationsSdkModule.forFeature({
      domains: ['frontend-commerceos-connect-integrations'],
      env: {
        translationsApi: `${environment.microUrlTranslationStorage}/translations`,
      },
      locales: [
        SupportedLocalesEnum.en,
        SupportedLocalesEnum.de,
        SupportedLocalesEnum.da,
        SupportedLocalesEnum.es,
        SupportedLocalesEnum.no,
        SupportedLocalesEnum.sv,
      ],
    }),
  ],
  providers: [
    // IntegrationEsExportCommand,
    ExportIntegrationCommand,
    ExportIntegrationSubscriptions,
    IntegrationEsExportCommand,
    SetupDefaultCategoriesCommand,
    ReindexAllowedBusinessesCommand,
    ReindexExcludedIntegrationsCommand,
    // Constraints
    IntegrationsBusinessConstraint,
    // Producers
    EventProducer,
    IntegrationEventProducer,
    IntegrationSubscriptionEventProducer,
    // Listeners
    FolderDocumentsListener,
    IntegrationSubscriptionListener,
    IntegrationListener,
    // Services
    BusinessService,
    BusinessServiceLocal,
    CategoryService,
    IntegrationService,
    IntegrationSubscriptionService,
    IntegrationWrapperSubscriptionService,
  ],
})
export class IntegrationModule { }
