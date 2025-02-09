import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessModuleLocal } from '../business/business.module';
import {
  IntegrationBusMessageController,
  BuilderIntegrationController,
  IntegrationSubscriptionController,
} from './controllers';
import { AdminController } from './controllers/admin.controller';
import { IntegrationSubscriptionEventsListener } from './event-listeners';
import {
  IntegrationRuleSchema,
  IntegrationRuleSchemaName,
  IntegrationSchema,
  IntegrationSchemaName,
  IntegrationSubscriptionSchema,
  IntegrationSubscriptionSchemaName,
} from './schemas';
import {
  IntegrationRuleService,
  IntegrationService,
  IntegrationSubscriptionService,
  ThirdPartyService,
} from './services';

@Module({
  controllers: [
    IntegrationBusMessageController,
    IntegrationSubscriptionController,
    AdminController,
    BuilderIntegrationController,
  ],
  exports: [
    IntegrationService,
    IntegrationSubscriptionService,
    IntegrationRuleService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: IntegrationSchemaName, schema: IntegrationSchema },
      { name: IntegrationSubscriptionSchemaName, schema: IntegrationSubscriptionSchema },
      { name: IntegrationRuleSchemaName, schema: IntegrationRuleSchema },
    ]),
    forwardRef(() => BusinessModuleLocal),
  ],
  providers: [
    IntegrationService,
    IntegrationSubscriptionService,
    IntegrationRuleService,
    IntegrationSubscriptionEventsListener,
    ThirdPartyService,
  ],
})
export class IntegrationModule { }
