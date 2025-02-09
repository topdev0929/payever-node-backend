import { HttpModule, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApmModule } from '@pe/nest-kit/modules/apm';
import { JwtAuthModule } from '@pe/nest-kit/modules/auth';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';

import { CommonModelsNamesEnum, CommonSdkModule } from '@pe/common-sdk';
import { CommandModule, DefaultMongooseConfig, MutexModule, RabbitMqModule, RedisModule } from '@pe/nest-kit';
import { EventDispatcherModule } from '@pe/nest-kit/modules/event-dispatcher';
import { ElasticSearchModule } from '@pe/elastic-kit';

import { CurrencyModule } from './currency';
import { FiltersConfig, IntegrationModule } from './integration';
import { PaymentsModule } from './payments';
import { environment } from './environments';

import { MigrationModule } from '@pe/migration-kit/module/migration.module';


@Module({
  imports: [
    ElasticSearchModule.forRoot({
      authPassword: environment.elasticEnv.elasticSearchAuthPassword,
      authUsername: environment.elasticEnv.elasticSearchAuthUsername,
      cloudId: environment.elasticEnv.elasticSearchCloudId,
      host: environment.elasticEnv.elasticSearchHost,
    }),
    RedisModule.forRoot(environment.redis),
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    JwtAuthModule.forRoot(environment.jwtOptions),
    HttpModule,
    CurrencyModule,
    IntegrationModule,
    PaymentsModule,
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    ApmModule.forRoot(
      environment.apm.enable,
      environment.apm.options,
    ),
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    EventDispatcherModule,
    RabbitMqModule.forRoot(environment.rabbitmq),
    CommandModule,
    CommonSdkModule.forRoot({
      channel: 'async_events_connect_micro',
      consumerModels: [
        CommonModelsNamesEnum.CurrencyModel,
      ],
      filters: FiltersConfig,
      rsaPath: environment.rsa,
    }),
    MutexModule,
    MigrationModule,
  ],
})
export class ApplicationModule implements NestModule {
  public configure(): void {
  }
}
