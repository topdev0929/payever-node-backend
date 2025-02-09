import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaSdkModule } from '@pe/media-sdk';
import { BusinessModule } from '../business/business.module';
import { IntegrationModule } from '../integration/integration.module';
import {
  BusinessSchema,
  BusinessSchemaName,
  ChannelSetSchema,
  ChannelSetSchemaName,
  CheckoutIntegrationSubSchema,
  CheckoutIntegrationSubSchemaName,
  CheckoutSchema,
  CheckoutSchemaName,
  IntegrationSchema,
  IntegrationSchemaName,
  SectionSchema,
  SectionSchemaName,
  BusinessDetailSchemaName,
  BusinessDetailSchema,
  PendingInstallationName,
  PendingInstallationSchema,
} from '../mongoose-schema';
import {
  CheckoutEsExportCommand,
  CheckoutExportCommand,
  CheckoutIntegrationsCheckCommand,
  CheckoutMediaAssignedCheckCommand,
  SwitchConnectionVersionCommand,
  CreateMissedChannelsSetsCommand,
  CheckoutAddOcrSectionCommand,
} from './commands';
import {
  AdminCheckoutController,
  CheckoutController,
  CheckoutIntegrationSubscriptionController,
  CheckoutSettingsController,
  SectionsController,
} from './controllers';
import {
  CheckoutEventsListener,
  CheckoutIntegrationEventsListener,
  CheckoutMediaEventsListener,
  CheckoutNotificationCreateListener,
} from './event-listeners';
import {
  CheckoutService,
  CheckoutElasticService,
  SectionsService,
} from './services';
import { FlowCheckoutConverter } from './conventers';
import { ConnectionModule } from '../connection/connection.module';
import { ChannelSetModule } from '../channel-set/channel-set.module';
import { CommonModule } from '../common/common.module';
import { CheckoutConsumer } from './consumers';

@Module({
  controllers: [
    AdminCheckoutController,
    CheckoutController,
    CheckoutIntegrationSubscriptionController,
    CheckoutSettingsController,
    SectionsController,
    CheckoutConsumer,
  ],
  exports: [
    CheckoutService,
    SectionsService,
  ],
  imports: [
    HttpModule,
    BusinessModule,
    forwardRef(() => ConnectionModule),
    forwardRef(() => ChannelSetModule),
    forwardRef(() => CommonModule),
    IntegrationModule,
    MediaSdkModule,
    MongooseModule.forFeature([
      {
        name: BusinessSchemaName,
        schema: BusinessSchema,
      },
      {
        name: ChannelSetSchemaName,
        schema: ChannelSetSchema,
      },
      {
        name: CheckoutSchemaName,
        schema: CheckoutSchema,
      },
      {
        name: PendingInstallationName,
        schema: PendingInstallationSchema,
      },
      {
        name: CheckoutIntegrationSubSchemaName,
        schema: CheckoutIntegrationSubSchema,
      },
      {
        name: SectionSchemaName,
        schema: SectionSchema,
      },
      {
        name: IntegrationSchemaName,
        schema: IntegrationSchema,
      },
      {
        name: BusinessDetailSchemaName,
        schema: BusinessDetailSchema,
      },
    ]),
  ],
  providers: [
    // Commands
    CheckoutEsExportCommand,
    CheckoutAddOcrSectionCommand,
    CheckoutExportCommand,
    CheckoutIntegrationsCheckCommand,
    CheckoutMediaAssignedCheckCommand,
    SwitchConnectionVersionCommand,
    CreateMissedChannelsSetsCommand,
    // Listeners
    CheckoutEventsListener,
    CheckoutIntegrationEventsListener,
    CheckoutMediaEventsListener,
    CheckoutNotificationCreateListener,
    // Services
    CheckoutElasticService,
    CheckoutService,
    FlowCheckoutConverter,
    SectionsService,
  ],
})
export class CheckoutModule { }
