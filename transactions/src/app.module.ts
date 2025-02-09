import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CronModule } from '@pe/cron-kit';
import {
  ApmModule,
  CommandModule,
  DefaultMongooseConfig,
  JwtAuthModule,
  MutexModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { ArchivedTransactionsModule } from './archived-transactions';
import { environment } from './environments';
import { IntegrationModule } from './integration';
import { TransactionsModule } from './transactions/transactions.module';
import { OrdersModule } from './orders/orders.module';
import { CommonModule } from './common/common.module';
import { MigrationModule } from '@pe/migration-kit';

@Module({
  imports: [
    ApmModule.forRoot(
      environment.apm.enable,
      environment.apm.options,
    ),
    CommandModule,
    JwtAuthModule.forRoot(environment.jwtOptions),
    RedisModule.forRoot(environment.redis),
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    RabbitMqModule.forRoot(environment.rabbitmq),
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    MutexModule,
    ArchivedTransactionsModule,
    IntegrationModule,
    OrdersModule,
    TransactionsModule.forRoot(),
    CronModule,
    CommonModule,
    MigrationModule.forRoot({ }),
  ],
  providers: [
  ],
})
export class AppModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
