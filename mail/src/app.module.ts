import {
  BadRequestException,
  HttpException,
  HttpModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { Error } from 'mongoose';
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
import 'reflect-metadata';
import { ApplicationTypesEnum, BuilderThemeModule } from '@pe/builder-theme-kit';
import { CronModule } from '@pe/cron-kit';
import { environment } from './environments';
import { BusinessModule, CampaignModule } from './modules';
import { SubscriptionsSdkModule } from '@pe/subscriptions-sdk/modules';
import { MailSchemaName } from './modules/mongoose-schema/mongoose-schema.names';
import { MailModule, MailSchema } from './modules/mail';
import { EventsSchema, EventsSchemaName } from './modules/mail/schemas/events-schema';
import { RabbitChannelsEnum } from './rabbitmq';
import { ElasticSearchModule } from '@pe/elastic-kit';

@Module({
  imports: [
    HttpModule,
    CommandModule,
    CronModule,
    ChannelsModule.forRoot({
      channelSetPerSubscription: ChannelSetPerSubscription.ManyToOne,
    }),
    ErrorsHandlerModule.forRoot([{
      exceptions: [BadRequestException],
      name: ErrorHandlersEnum.dtoValidation,
    }, {
      exceptions: [Error.ValidationError],
      name: ErrorHandlersEnum.uniqueEntity,
    }, {
      exceptions: [HttpException],
      name: ErrorHandlersEnum.defaultHttp,
    }]),
    SubscriptionsSdkModule.forRoot({
      features: [
        {
          allowedValues: ['show', 'hide'],
          name: 'text',
          type: String,
        },
      ],
    }),
    GraphQLModule.forRoot({
      context: ({ req }: { req: any }): { req: any } => ({ req }),
      installSubscriptionHandlers: true,
      typePaths: ['./**/*.graphql'],
    }),
    JwtAuthModule.forRoot(environment.jwtOptions),
    RedisModule.forRoot(environment.redis),
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    EventDispatcherModule,
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    ApmModule.forRoot(
      environment.apm.enable,
      environment.apm.options,
    ),
    RabbitMqModule.forRoot(environment.rabbitmq),
    BusinessModule,
    CampaignModule,
    MailModule,
    ElasticSearchModule.forRoot(environment.elasticEnv),
    BuilderThemeModule.forRoot({
      applicationSchema: MailSchema,
      applicationSchemaName: MailSchemaName,
      applicationType: ApplicationTypesEnum.Mail,
      channel: RabbitChannelsEnum.Marketing,
      redisUrl: environment.redis.url,
    }),
    EventsModule.forRoot({
      applicationSchema: EventsSchema,
      applicationSchemaName: EventsSchemaName,
      applicationType: EventsApplicationTypesEnum.Mail,
      filterFields: ['applicationId', 'sessionId'],
    }),
  ],
})

export class ApplicationModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void { }
}
