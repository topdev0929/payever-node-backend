import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ApiCallService,
  ChannelSetRetriever,
  CheckoutDbService,
  CheckoutIntegrationSubscriptionService,
  CurrencyExchangeService,
  OauthService,
  PaymentMethodMigrationMappingService,
  ValidationService,
  ChannelFilterService,
  CacheManager,
} from './services';
import {
  ApiCallSchema,
  ApiCallSchemaName,
  ChannelSetSchema,
  ChannelSetSchemaName,
  CheckoutIntegrationSubSchema,
  CheckoutIntegrationSubSchemaName,
  CheckoutSchema,
  CheckoutSchemaName,
  PaymentMethodMigrationMappingSchema,
  PaymentMethodMigrationMappingSchemaName,
} from '../mongoose-schema';
import { SendRabbitEventApiCallListener } from './event-listeners';
import { RabbitEventsProducer } from './producer';
import { ApiCallsExportCommand, SetPaymentMethodMigrationMappingCommand } from './commands';
import { ConnectionModule } from '../connection/connection.module';
import { ChannelSetModule } from '../channel-set/channel-set.module';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  controllers: [
  ],
  exports: [
    ApiCallService,
    ChannelSetRetriever,
    CheckoutDbService,
    CheckoutIntegrationSubscriptionService,
    CurrencyExchangeService,
    OauthService,
    RabbitEventsProducer,
    ValidationService,
    ChannelFilterService,
    PaymentMethodMigrationMappingService,
    CacheManager,
  ],
  imports: [
    forwardRef(() => ChannelSetModule),
    forwardRef(() => ConnectionModule),
    forwardRef(() => IntegrationModule),
    MongooseModule.forFeature([
      {
        name: ApiCallSchemaName,
        schema: ApiCallSchema,
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
        name: CheckoutIntegrationSubSchemaName,
        schema: CheckoutIntegrationSubSchema,
      },
      {
        name: PaymentMethodMigrationMappingSchemaName,
        schema: PaymentMethodMigrationMappingSchema,
      },
    ]),
  ],
  providers: [
    ApiCallsExportCommand,
    SetPaymentMethodMigrationMappingCommand,

    ApiCallService,
    ChannelSetRetriever,
    CheckoutDbService,
    CheckoutIntegrationSubscriptionService,
    CurrencyExchangeService,
    OauthService,
    PaymentMethodMigrationMappingService,
    RabbitEventsProducer,
    ValidationService,
    ChannelFilterService,
    CacheManager,

    SendRabbitEventApiCallListener,
  ],
})
export class CommonModule { }
