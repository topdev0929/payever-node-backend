import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  IntegrationSchema,
  IntegrationSchemaName,
  IntegrationSubscriptionSchema,
  IntegrationSubscriptionSchemaName,
} from '@pe/third-party-sdk';

import { BusinessSchema } from '../business/schemas';
import { InternalRequestProxy } from '../common';
import { BusinessSchemaName } from '../common/mongoose-schema.names';
import { IntegrationModule } from '../third-party/integration.module';
import { PaymentProxyController, TransactionProxyController } from './controllers';
import { EventProducer } from './producer';

@Module({
  controllers: [
    PaymentProxyController,
    TransactionProxyController,
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
    IntegrationModule,
  ],
  providers: [
    EventProducer,
    InternalRequestProxy,
  ],
})
export class PaymentsModule { }
