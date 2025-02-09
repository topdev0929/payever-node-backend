import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApmModule, CommandModule, DefaultMongooseConfig, RabbitMqModule, RedisModule } from '@pe/nest-kit';
import { JwtAuthModule } from '@pe/nest-kit/modules/auth';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { environment } from './environments';
import { BusinessModule } from './business';
import { FinanceExpressModule } from './finance-express';
import { MigrationModule } from '@pe/migration-kit/module/migration.module';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { ChannelsModule } from '@pe/channels-sdk';

@Module({
  imports: [
    ApmModule.forRoot(
      environment.apm.enable, 
      environment.apm.options,
    ),
    ChannelsModule.forRoot({
      channel: 'async_events_finance_express_micro',
      channelSetPerSubscription: 'many-to-one',
      microservice: 'finance-express',
    }),
    CommandModule,
    JwtAuthModule.forRoot(environment.jwtOptions),
    MigrationModule,
    MongooseModule.forRoot(
      environment.mongodb, 
      DefaultMongooseConfig,
    ),
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    RabbitMqModule.forRoot(environment.rabbitmq),
    RedisModule.forRoot(environment.redis),
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),

    BusinessModule,
    FinanceExpressModule,
  ],
})
export class AppModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
