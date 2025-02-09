import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  IntegrationSchema,
  IntegrationSchemaName,
  IntegrationSubscriptionSchema,
  IntegrationSubscriptionSchemaName,
} from '@pe/third-party-sdk';

import { BusinessModule } from '../business/business.module';
import { BusinessSchema } from '../business/schemas';
import { BusinessSchemaName } from '../common/mongoose-schema.names';
import { PluginsSubscriptionController } from './controllers';

@Module({
  controllers: [
    PluginsSubscriptionController,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: BusinessSchemaName,
        schema: BusinessSchema,
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
    BusinessModule,
  ],
  providers: [],
})
export class PluginsModule { }
