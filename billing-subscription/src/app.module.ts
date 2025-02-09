import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ApmModule,
  CommandModule,
  DefaultMongooseConfig,
  ErrorHandlersEnum,
  ErrorsHandlerModule,
  EventDispatcherModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { Error } from 'mongoose';
import { EventsApplicationTypesEnum, EventsModule } from '@pe/events-kit';
import { JwtAuthModule } from '@pe/nest-kit/modules/auth';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { ElasticSearchModule } from '@pe/elastic-kit';
import { EntityExistsException, ValidationFailedException } from './exceptions';
import { environment, RabbitChannelsEnum } from './environments';
import { BusinessModuleLocal } from './business';
import { SubscriptionModule } from './subscriptions/subscription.module';
import { ChannelsModule } from '@pe/channels-sdk';
import { EventsSchema, EventsSchemaName } from './subscriptions/schemas/events-schema';
import { MigrationModule } from '@pe/migration-kit';

@Module({
  controllers: [],
  imports: [
    HttpModule,
    ChannelsModule.forRoot({
      channel: 'async_events_billing_subscription_micro',
      channelSetPerSubscription: 'many-to-one',
      microservice: 'subscriptions',
    }),
    CommandModule,
    ElasticSearchModule.forRoot({
      authPassword: environment.elasticEnv.elasticSearchAuthUsername,
      authUsername: environment.elasticEnv.elasticSearchAuthPassword,
      cloudId: environment.elasticEnv.elasticSearchCloudId,
      host: environment.elasticEnv.elasticSearchHost,
    }),
    JwtAuthModule.forRoot(environment.jwtOptions),
    RedisModule.forRoot(environment.redis),
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    ApmModule.forRoot(
      environment.apm.enable,
      environment.apm.options,
    ),
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    ErrorsHandlerModule.forRoot([
      {
        exceptions: [Error.ValidationError],
        name: ErrorHandlersEnum.uniqueEntity,
      },
      {
        exceptions: [ValidationFailedException, EntityExistsException],
        name: 'dto-validation',
      },
    ]),
    EventDispatcherModule,
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    RabbitMqModule.forRoot(environment.rabbitmq),
    BusinessModuleLocal,
    SubscriptionModule,
    EventsModule.forRoot({
      applicationSchema: EventsSchema,
      applicationSchemaName: EventsSchemaName,
      applicationType: EventsApplicationTypesEnum.Subscriptions,
      filterFields: ['applicationId', 'sessionId'],
      rabbitChannel: RabbitChannelsEnum.BillingSubscription,
    }),
    MigrationModule.forRoot({ }),
  ],
  providers: [],
})

export class ApplicationModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
