import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConnectionSchema,
  ConnectionSchemaName,
  IntegrationSchema,
  IntegrationSchemaName,
  IntegrationSubscriptionSchema,
  IntegrationSubscriptionSchemaName,
} from '@pe/third-party-sdk';
import { BusinessService } from '@pe/business-kit';

import { BusinessSchema } from '../business/schemas';
import { BusinessSchemaName } from '../common/mongoose-schema.names';
import { ExportSubscriptionsToConnectionsCommand, MigrateSubscriptionsCommand } from './commands';
import { DeprecatedIntegrationController, DeprecatedSubscriptionController } from './controllers';
import { DeprecatedConnectionEventsProducer } from './producer';
import { DeprecatedIntegrationApiService } from './services';

@Module({
  controllers: [
    DeprecatedIntegrationController,
    DeprecatedSubscriptionController,
  ],
  exports: [
    DeprecatedConnectionEventsProducer,
    DeprecatedIntegrationApiService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: BusinessSchemaName,
        schema: BusinessSchema,
      },
      {
        name: ConnectionSchemaName,
        schema: ConnectionSchema,
      },
      {
        name: IntegrationSchemaName,
        schema: IntegrationSchema,
      },
      {
        name: IntegrationSubscriptionSchemaName,
        schema: IntegrationSubscriptionSchema,
      },
    ]),
  ],
  providers: [
    BusinessService,
    DeprecatedConnectionEventsProducer,
    ExportSubscriptionsToConnectionsCommand,
    DeprecatedIntegrationApiService,
    MigrateSubscriptionsCommand,
  ],
})
export class IntegrationModule { }
