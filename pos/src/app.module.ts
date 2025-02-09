import { BadRequestException, HttpException, HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelSetPerSubscription, ChannelsModule } from '@pe/channels-sdk';
import {
  CommandModule,
  DefaultMongooseConfig,
  ErrorHandlersEnum,
  ErrorsHandlerModule,
  EventDispatcherModule,
  JwtAuthModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { ApmModule } from '@pe/nest-kit/modules/apm';
import { EventsApplicationTypesEnum, EventsModule } from '@pe/events-kit';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { ElasticSearchModule } from '@pe/elastic-kit';
import { BusinessModule } from './business';
import { environment } from './environments';
import { IntegrationModule } from './integration/integration.module';
import { TerminalModule } from './terminal/terminal.module';
import { Error } from 'mongoose';
import { SubscriptionsSdkModule } from '@pe/subscriptions-sdk/modules';
import { NotificationsSdkModule } from '@pe/notifications-sdk';
import { ApplicationTypesEnum, BuilderThemeModule } from '@pe/builder-theme-kit';
import { TerminalSchemaName } from './mongoose-schema/mongoose-schema.names';
import { TerminalSchema } from './terminal/schemas';
import { EventsSchema, EventsSchemaName } from './terminal/schemas/events';
import { TerminalRabbitEventNamesEnum } from './terminal/enums';
import { UpdateOptionalChannelTypesCommand } from './commands';

import { MigrationModule } from '@pe/migration-kit/module/migration.module';

@Module({
  imports: [
    HttpModule,
    CommandModule,
    ElasticSearchModule.forRoot({
      authPassword: environment.elastic.password,
      authUsername: environment.elastic.username,
      cloudId: environment.elastic.cloudId,
      host: environment.elastic.host,
    }),
    ErrorsHandlerModule.forRoot([
      {
        exceptions: [BadRequestException],
        name: ErrorHandlersEnum.dtoValidation,
      },
      {
        exceptions: [Error.ValidationError],
        name: ErrorHandlersEnum.uniqueEntity,
      },
      {
        exceptions: [HttpException],
        name: ErrorHandlersEnum.defaultHttp,
      },
    ]),
    SubscriptionsSdkModule.forRoot({
      channel: 'async_events_pos_micro',
      features: [
        {
          allowedValues: ['show', 'hide'],
          name: 'text',
          type: String,
        },
      ],
      microservice: 'pos',
    }),
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    JwtAuthModule.forRoot(environment.jwtOptions),
    RedisModule.forRoot(environment.redis),
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    EventDispatcherModule,
    ApmModule.forRoot(environment.apm.enable, environment.apm.options),
    RabbitMqModule.forRoot(environment.rabbitmq),
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    ChannelsModule.forRoot({
      channel: TerminalRabbitEventNamesEnum.channelName,
      channelSetPerSubscription: ChannelSetPerSubscription.ManyToOne,
      microservice: 'pos',
    }),
    NotificationsSdkModule,
    BusinessModule,
    IntegrationModule,
    TerminalModule,
    BuilderThemeModule.forRoot({
      applicationSchema: TerminalSchema,
      applicationSchemaName: TerminalSchemaName,
      applicationType: ApplicationTypesEnum.Pos,
      channel: TerminalRabbitEventNamesEnum.channelName,
      redisUrl: environment.redis.url,
    }),
    EventsModule.forRoot({
      applicationSchema: EventsSchema,
      applicationSchemaName: EventsSchemaName,
      applicationType: EventsApplicationTypesEnum.Pos,
      filterFields: ['applicationId', 'sessionId'],
    }),
    MigrationModule,
  ],
  providers: [
    UpdateOptionalChannelTypesCommand,
  ],
})
export class ApplicationModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void { }
}
