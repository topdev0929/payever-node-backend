import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Error } from 'mongoose';
import {
  ApmModule,
  CommandModule,
  DefaultMongooseConfig,
  ErrorHandlersEnum,
  ErrorsHandlerModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { EventsApplicationTypesEnum, EventsModule } from '@pe/events-kit';
import { JwtAuthModule } from '@pe/nest-kit/modules/auth';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { MutexModule } from '@pe/nest-kit/modules/mutex';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { CommonModelsNamesEnum, CommonSdkModule } from '@pe/common-sdk';
import { BusinessModule } from './business/business.module';
import { CheckoutAnalyticsModule } from './checkout-analytics/checkout-analytics.module';
import { MessageBusChannelsEnum } from './checkout-analytics/enums';
import { environment } from './environments';
import {
  CheckoutMetricsSchema,
  CheckoutMetricsSchemaName,
  CheckoutFormMetricsSchemaName,
} from './checkout-analytics/schemas';
import { CheckoutFormMetricsSchema } from './checkout-analytics/schemas/checkout-form-metrics.schema';
import { MigrationModule } from '@pe/migration-kit';

@Module({
  imports: [
    ApmModule.forRoot(
      environment.apm.enable,
      environment.apm.options,
    ),
    CommandModule,
    CommonSdkModule.forRoot({
      channel: MessageBusChannelsEnum.asyncEventsCheckoutAnalytics,
      consumerModels: [
        CommonModelsNamesEnum.CurrencyModel,
      ],
      rsaPath: environment.rsa,
    }),
    JwtAuthModule.forRoot(environment.jwtOptions),
    HttpModule,
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    ErrorsHandlerModule.forRoot([{
      exceptions: [Error.ValidationError],
      name: ErrorHandlersEnum.uniqueEntity,
    }]),
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    RabbitMqModule.forRoot(environment.rabbitmq),
    RedisModule.forRoot(environment.redis),
    BusinessModule,
    MutexModule,
    CheckoutAnalyticsModule,
    EventsModule.forRoot({
      applicationSchema: CheckoutMetricsSchema,
      applicationSchemaName: CheckoutMetricsSchemaName,
      applicationType: EventsApplicationTypesEnum.CheckoutAnalytics,
      filterFields: ['paymentFlowId', 'paymentMethod'],
      rabbitChannel: MessageBusChannelsEnum.asyncEventsCheckoutAnalytics,
      skipNotFoundMetricsCreation: true,

      formMetrics: {
        filterFields: ['paymentFlowId', 'paymentMethod'],
        name: CheckoutFormMetricsSchemaName,
        schema: CheckoutFormMetricsSchema,
      },
    }),
    MigrationModule.forRoot({ }),
  ],
})
export class ApplicationModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
