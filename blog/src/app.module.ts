import { BadRequestException, HttpException, HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelSetPerSubscription, ChannelsModule } from '@pe/channels-sdk';
import { ApplicationTypesEnum, BuilderThemeModule } from '@pe/builder-theme-kit';

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
import { SubscriptionsSdkModule } from '@pe/subscriptions-sdk/modules';
import { NotificationsSdkModule } from '@pe/notifications-sdk';
import { CustomerKitModule } from '@pe/customer-kit/module/customer-kit.module';

import { BusinessModuleLocal } from './business';
import { BlogModule, BlogSchema } from './blog';
import { CommentModule } from './comment';
import { Error } from 'mongoose';
import { BlogSchemaName } from './mongoose-schema/mongoose-schema.names';
import { environment } from './environments';
import { EventsSchema, EventsSchemaName } from './blog/schemas/events-schema';
import { MessageBusChannelsEnum } from './blog/enums';
import { KubernetesKitModule } from '@pe/kubernetes-kit/module/kubernetes-kit.module';
import { K8sApplicationTypesEnum } from '@pe/kubernetes-kit/module/configs/enums';
import { IntegrationModule } from './integration/integration.module';
import { CustomerApplicationTypesEnum } from '@pe/customer-kit/module/customer/enums';


@Module({
  imports: [
    HttpModule,
    CommandModule,
    CustomerKitModule.forRoot(
      {
        appType: CustomerApplicationTypesEnum.Blog,
        channel: MessageBusChannelsEnum.blog as string,
      },
    ),
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
      channel: MessageBusChannelsEnum.blog,
      features: [
        {
          allowedValues: ['show', 'hide'],
          name: 'text',
          type: String,
        },
      ],
      microservice: 'blog',
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
      channel: MessageBusChannelsEnum.blog,
      channelSetPerSubscription: ChannelSetPerSubscription.ManyToOne,
      microservice: 'blog',
    }),
    NotificationsSdkModule,
    BusinessModuleLocal,
    BlogModule,
    CommentModule,
    EventsModule.forRoot({
      applicationSchema: EventsSchema,
      applicationSchemaName: EventsSchemaName,
      applicationType: EventsApplicationTypesEnum.Blog,
      filterFields: ['applicationId', 'sessionId'],
    }),
    BuilderThemeModule.forRoot({
      applicationSchema: BlogSchema,
      applicationSchemaName: BlogSchemaName,
      applicationType: ApplicationTypesEnum.Blog,
      channel: MessageBusChannelsEnum.blog,
      redisConfig: environment.redis,
    }),
    KubernetesKitModule.forRoot(
      {
        applicationType: K8sApplicationTypesEnum.Blog,
        channel: MessageBusChannelsEnum.blog,
      },
    ),
    IntegrationModule,
  ],
})
export class ApplicationModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void { }
}
