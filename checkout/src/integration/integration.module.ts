import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessModule } from '../business/business.module';
import {
  BusinessIntegrationSubSchema,
  BusinessIntegrationSubSchemaName,
  BusinessSchema,
  BusinessSchemaName,
  IntegrationSchema,
  IntegrationSchemaName,
} from '../mongoose-schema';
import { ApplicationSubscriptionConsumer, BusinessIntegrationInstallationConsumer } from './consumers';
import { AdminIntegrationController, BusinessIntegrationSubController, IntegrationController } from './controllers';
import { BusinessIntegrationEventsListener } from './event-listeners';
import { BusinessIntegrationSubscriptionService, IntegrationService } from './services';

@Module({
  controllers: [
    ApplicationSubscriptionConsumer,
    BusinessIntegrationInstallationConsumer,
    // Controllers
    AdminIntegrationController,
    BusinessIntegrationSubController,
    IntegrationController,
  ],
  exports: [
    BusinessIntegrationSubscriptionService,
    IntegrationService,
  ],
  imports: [
    HttpModule,
    BusinessModule,
    MongooseModule.forFeature([
      {
        name: BusinessSchemaName,
        schema: BusinessSchema,
      },
      {
        name: BusinessIntegrationSubSchemaName,
        schema: BusinessIntegrationSubSchema,
      },
      {
        name: IntegrationSchemaName,
        schema: IntegrationSchema,
      },
    ]),
  ],
  providers: [
    BusinessIntegrationEventsListener,
    BusinessIntegrationSubscriptionService,
    IntegrationService,
  ],
})
export class IntegrationModule { }
