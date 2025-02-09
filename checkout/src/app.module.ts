import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Error } from 'mongoose';

import { CommonModelsNamesEnum, CommonSdkModule } from '@pe/common-sdk';
import { MigrationModule } from '@pe/migration-kit/module/migration.module';
import {
  ApmModule,
  CommandModule,
  DefaultMongooseConfig,
  ErrorHandlersEnum,
  ErrorsHandlerModule,
  EventDispatcherModule,
  IntercomModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { JwtAuthModule } from '@pe/nest-kit/modules/auth';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { MutexModule } from '@pe/nest-kit/modules/mutex';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { ElasticSearchModule } from '@pe/elastic-kit';
import { BusinessModule } from './business/business.module';
import { ChannelSetModule } from './channel-set/channel-set.module';
import { CheckoutModule } from './checkout/checkout.module';
import { ConnectionModule } from './connection/connection.module';
import { FlowModule } from './flow/flow.module';
import { IntegrationModule } from './integration/integration.module';
import { LegacyApiModule } from './legacy-api/legacy-api.module';
import { MailReportModule } from './mail-report/mail-report.module';
import { environment, MessageBusChannelsEnum } from './environments';
import { CommonModule } from './common/common.module';
import { ApplicationTypeEnum } from './common/enum';
import { NotificationsSdkModule } from '@pe/notifications-sdk';
import { FinanceExpressModule } from './finance-express/finance-express.module';
import { PaymentLinksModule } from './payment-links/payment-links.module';
import { FiltersConfig } from './payment-links/configs/filters-config';
import { CronModule } from '@pe/cron-kit';
import { SchedulerModule } from './scheduler/scheduler.module';

const applicationModule: any = (): any => {
  if (!environment.applicationType) {
    throw new Error(`Environment variable "CHECKOUT_APPLICATION_TYPE" is not set`);
  }

  switch (environment.applicationType) {
    case ApplicationTypeEnum.All:
      return [CheckoutModule, FlowModule, LegacyApiModule];
    case ApplicationTypeEnum.CheckoutApp:
      return [CheckoutModule];
    case ApplicationTypeEnum.Flow:
      return [FlowModule];
    case ApplicationTypeEnum.ExternalApi:
      return [LegacyApiModule];
    default:
      throw new Error(`Environment variable "CHECKOUT_APPLICATION_TYPE" is unknown`);
  }
};

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
    NotificationsSdkModule,
    ErrorsHandlerModule.forRoot([{
      exceptions: [Error.ValidationError],
      name: ErrorHandlersEnum.uniqueEntity,
    }]),
    EventDispatcherModule,
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    RabbitMqModule.forRoot(environment.rabbitmq),
    CommonSdkModule.forRoot({
      channel: MessageBusChannelsEnum.checkout,
      consumerModels: [
        CommonModelsNamesEnum.CountryModel,
        CommonModelsNamesEnum.CurrencyModel,
        CommonModelsNamesEnum.LanguageModel,
      ],
      filters: FiltersConfig,
      rsaPath: environment.rsa,
    }),
    MutexModule,
    MigrationModule,
    IntercomModule,
    CronModule,

    CommonModule,
    BusinessModule,
    MailReportModule,
    ChannelSetModule,
    ConnectionModule,
    IntegrationModule,
    PaymentLinksModule,
    FinanceExpressModule,
    SchedulerModule,

    ...applicationModule(),
  ],
})
export class ApplicationModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
