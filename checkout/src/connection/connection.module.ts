import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessModule } from '../business/business.module';
import { IntegrationModule } from '../integration/integration.module';
import {
  BusinessIntegrationSubSchema,
  BusinessIntegrationSubSchemaName,
  BusinessSchema,
  BusinessSchemaName,
  CheckoutIntegrationSubSchema,
  CheckoutIntegrationSubSchemaName,
  CheckoutSchema,
  CheckoutSchemaName,
  ConnectionSchema,
  ConnectionSchemaName,
  IntegrationSchema,
  IntegrationSchemaName,
} from '../mongoose-schema';
import {
  AssignCustomAmountCommand,
  ExportConnectionsCommand,
  RemoveDuplicatedSubsCommand,
  RestoreSubsByConnectionsCommand,
  SwitchDefaultConnectionUsageCommand,
} from './commands';
import { BpoConsumer, ThirdPartyConnectionConsumer } from './consumers';
import {
  BusinessConnectionController,
  ChannelSetConnectionAnonController,
  CheckoutConnectionController,
} from './controllers';
import { ConnectionEventsListener, PaymentConnectionEventsListener } from './event-listeners';
import { CheckoutConnectionRabbitProducer } from './rabbit-producers';
import {
  BpoActiveService,
  CheckoutConnectionService,
  ConnectionService,
  BusinessAmountLimitsService,
} from './services';
import { CommonModule } from '../common/common.module';

@Module({
  controllers: [
    BpoConsumer,
    BusinessConnectionController,
    CheckoutConnectionController,
    ChannelSetConnectionAnonController,
    ThirdPartyConnectionConsumer,
  ],
  exports: [
    CheckoutConnectionService,
    ConnectionService,
    BusinessAmountLimitsService,
  ],
  imports: [
    HttpModule,
    BusinessModule,
    forwardRef(() => CommonModule),
    IntegrationModule,
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
        name: CheckoutSchemaName,
        schema: CheckoutSchema,
      },
      {
        name: IntegrationSchemaName,
        schema: IntegrationSchema,
      },
      {
        name: CheckoutIntegrationSubSchemaName,
        schema: CheckoutIntegrationSubSchema,
      },
      {
        name: ConnectionSchemaName,
        schema: ConnectionSchema,
      },
    ]),
  ],
  providers: [
    AssignCustomAmountCommand,
    BpoActiveService,
    CheckoutConnectionRabbitProducer,
    CheckoutConnectionService,
    ConnectionEventsListener,
    ConnectionService,
    ExportConnectionsCommand,
    PaymentConnectionEventsListener,
    RemoveDuplicatedSubsCommand,
    RestoreSubsByConnectionsCommand,
    BusinessAmountLimitsService,
    SwitchDefaultConnectionUsageCommand,
  ],
})
export class ConnectionModule { }
