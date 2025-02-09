import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocalBusinessModule } from '../business/business.module';
import {
  IntegrationBusMessageController,
  IntegrationSubscriptionController,
} from './controllers';
import { IntegrationSubscriptionEventsListener } from './event-listeners';
import {
  IntegrationSchema,
  IntegrationSchemaName,
  IntegrationSubscriptionSchema,
  IntegrationSubscriptionSchemaName,
} from './schemas';
import {
  IntegrationService,
  IntegrationSubscriptionService,
} from './services';

@Module({
  controllers: [
    IntegrationBusMessageController,
    IntegrationSubscriptionController,
  ],
  exports: [
    IntegrationService,
    IntegrationSubscriptionService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: IntegrationSchemaName, schema: IntegrationSchema },
      { name: IntegrationSubscriptionSchemaName, schema: IntegrationSubscriptionSchema },
    ]),
    forwardRef(() => LocalBusinessModule),
  ],
  providers: [
    IntegrationService,
    IntegrationSubscriptionService,
    IntegrationSubscriptionEventsListener,
  ],
})
export class IntegrationModule { }
