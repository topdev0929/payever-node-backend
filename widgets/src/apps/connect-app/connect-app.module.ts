import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ConnectIntegrationSchema,
  ConnectIntegrationSchemaName,
  ConnectIntegrationSubscriptionSchema,
  ConnectIntegrationSubscriptionSchemaName,
} from './schemas';
import { ConnectIntegrationService, ConnectIntegrationSubscriptionService } from './services';
import { ConnectIntegrationMessagesConsumer, ConnectIntegrationSubscriptionMessagesConsumer } from './consumers';

@Module({
  controllers: [
    ConnectIntegrationMessagesConsumer,
    ConnectIntegrationSubscriptionMessagesConsumer,
  ],
  exports: [
    ConnectIntegrationService,
    ConnectIntegrationSubscriptionService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [
        { name: ConnectIntegrationSchemaName, schema: ConnectIntegrationSchema },
        { name: ConnectIntegrationSubscriptionSchemaName, schema: ConnectIntegrationSubscriptionSchema },
      ],
    ),
  ],
  providers: [
    ConnectIntegrationService,
    ConnectIntegrationSubscriptionService,
  ],
})
export class ConnectAppModule { }
