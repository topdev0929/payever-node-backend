import {
  BadRequestException,
  HttpException,
  HttpModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
import { MigrationModule } from '@pe/migration-kit';
import { EventsApplicationTypesEnum, EventsModule } from '@pe/events-kit';
import { SubscriptionsSdkModule } from '@pe/subscriptions-sdk';
import { ApmModule } from '@pe/nest-kit/modules/apm';
import { ElasticSearchModule } from '@pe/elastic-kit';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { ChannelSetPerSubscription, ChannelsModule } from '@pe/channels-sdk';
import { ApplicationTypesEnum, BuilderThemeModule } from '@pe/builder-theme-kit';
import { CronModule } from '@pe/cron-kit';
import { BusinessModule } from '@pe/business-kit';
import { CustomerKitModule } from '@pe/customer-kit/module/customer-kit.module';

import { EntityExistsException, LastSiteRemovingException } from './common/exceptions';
import { environment } from './environments';
import { SitesModule } from './sites';
import { BusinessSchema, SiteSchema, SiteSchemaName } from './sites/schemas';
import { EventsSchema, EventsSchemaName } from './sites/schemas/events';
import { RabbitChannelsEnum } from './sites/enums';
import { KubernetesKitModule } from '@pe/kubernetes-kit/module/kubernetes-kit.module';
import { K8sApplicationTypesEnum } from '@pe/kubernetes-kit/module/configs/enums';
import { CustomerApplicationTypesEnum } from '@pe/customer-kit/module/customer/enums';

@Module({
  imports: [
    HttpModule,
    CustomerKitModule.forRoot(
      {
        appType: CustomerApplicationTypesEnum.Site,
        channel: RabbitChannelsEnum.Site as string,
      }
    ),
    CommandModule,
    ElasticSearchModule.forRoot({
      authPassword: environment.elastic.password,
      authUsername: environment.elastic.username,
      cloudId: environment.elastic.cloudId,
      host: environment.elastic.host,
    }),
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    JwtAuthModule.forRoot(environment.jwtOptions),
    RedisModule.forRoot(environment.redis),
    EventDispatcherModule,
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    CronModule,
    ApmModule.forRoot(environment.apm.enable, environment.apm.options),
    RabbitMqModule.forRoot(environment.rabbitmq),
    ErrorsHandlerModule.forRoot([
      {
        exceptions: [BadRequestException, EntityExistsException, LastSiteRemovingException],
        name: ErrorHandlersEnum.dtoValidation,
      },
      {
        exceptions: [HttpException],
        name: ErrorHandlersEnum.defaultHttp,
      },
    ]),
    ChannelsModule.forRoot({
      channel: RabbitChannelsEnum.Site,
      channelSetPerSubscription: ChannelSetPerSubscription.OneToOne,
      microservice: 'site',
    }),
    SubscriptionsSdkModule.forRoot({
      channel: RabbitChannelsEnum.Site,
      features: [],
      microservice: 'site',
    }),
    BuilderThemeModule.forRoot({
      applicationSchema: SiteSchema,
      applicationSchemaName: SiteSchemaName,
      applicationType: ApplicationTypesEnum.Site,
      channel: RabbitChannelsEnum.Site,
      redisConfig: environment.redis,
    }),
    EventsModule.forRoot({
      applicationSchema: EventsSchema,
      applicationSchemaName: EventsSchemaName,
      applicationType: EventsApplicationTypesEnum.Site,
      filterFields: ['applicationId', 'sessionId'],
      rabbitChannel: RabbitChannelsEnum.Site,
    }),
    KubernetesKitModule.forRoot(
      {
        applicationType: K8sApplicationTypesEnum.Site,
        channel: RabbitChannelsEnum.Site,
      },
    ),
    MigrationModule,
    BusinessModule.forRoot({
      rabbitChannel: RabbitChannelsEnum.Site,
      customSchema: BusinessSchema as any,
    }),
    SitesModule,
  ],
})
export class ApplicationModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
