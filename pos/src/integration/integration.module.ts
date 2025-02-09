import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessModule } from '../business';
import { TerminalModule } from '../terminal/terminal.module';
import { MongooseSchemas } from './config';
import {
  BusinessIntegrationSubscriptionController,
  IntegrationBusMessageController,
  TerminalIntegrationSubscriptionController,
} from './controllers';
import {
  BusinessIntegrationSubscriptionsEventsListener,
  TerminalIntegrationSubscriptionsEventsListener,
  UpdateSubscriptionListener,
} from './event-listeners';
import {
  BusinessIntegrationSubscriptionService,
  IntegrationService,
  TerminalIntegrationSubscriptionService,
} from './services';
import { TerminalConsumer } from './consumers';

@Module({
  controllers: [
    BusinessIntegrationSubscriptionController,
    IntegrationBusMessageController,
    TerminalIntegrationSubscriptionController,
    TerminalConsumer,
  ],
  imports: [
    HttpModule,
    BusinessModule,
    TerminalModule,
    MongooseModule.forFeature(MongooseSchemas),
  ],
  exports: [
    TerminalIntegrationSubscriptionService,
  ],
  providers: [
    BusinessIntegrationSubscriptionService,
    BusinessIntegrationSubscriptionsEventsListener,
    IntegrationService,
    TerminalIntegrationSubscriptionService,
    TerminalIntegrationSubscriptionsEventsListener,
    UpdateSubscriptionListener,
  ],
})
export class IntegrationModule { }
