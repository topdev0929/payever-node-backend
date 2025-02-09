import { HttpModule, Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CommandModule,
  DefaultMongooseConfig,
  EventDispatcherModule,
  JwtAuthModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { SubscriptionsSdkModule } from '@pe/subscriptions-sdk/modules';
import { ElasticSearchModule } from '@pe/elastic-kit';
import { BusinessModuleLocal } from './business/business.module';
import { ChannelSetModule } from './channel-set/channel-set.module';
import { IntegrationModule } from './integration/integration.module';
import { ShippingModule } from './shipping/shipping.module';
import { TransactionActionsModule } from './transaction-actions/transaction-actions.module';
import { environment } from './environments';
import { RabbitChannelsEnum } from './environments/rabbitmq';
import { MigrationModule } from '@pe/migration-kit';

@Module({
  imports: [
    HttpModule,
    CommandModule,
    ElasticSearchModule.forRoot({
      authPassword: environment.elasticEnv.elasticSearchAuthPassword,
      authUsername: environment.elasticEnv.elasticSearchAuthUsername,
      cloudId: environment.elasticEnv.elasticSearchCloudId,
      host: environment.elasticEnv.elasticSearchHost,
    }),
    SubscriptionsSdkModule.forRoot({
      channel: RabbitChannelsEnum.Shipping,
      features: [
        {
          allowedValues: ['show', 'hide'],
          name: 'text',
          type: String,
        },
      ],
      microservice: 'shipping',
    }),
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
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    RabbitMqModule.forRoot(environment.rabbitmq),
    EventDispatcherModule,
    BusinessModuleLocal,
    ChannelSetModule,
    IntegrationModule,
    ShippingModule,
    TransactionActionsModule,
    MigrationModule.forRoot({ }),
  ],
})
export class ApplicationModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
