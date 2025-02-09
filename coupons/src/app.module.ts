import { MongooseModule } from '@nestjs/mongoose';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import {
  CommandModule,
  DefaultMongooseConfig,
  JwtAuthModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { ChannelsModule, ChannelSetPerSubscription } from '@pe/channels-sdk';
import { SubscriptionsSdkModule } from '@pe/subscriptions-sdk';
import { StatusModule } from '@pe/nest-kit/modules/status';

import { CouponsModule } from './coupons/coupons.module';
import { environment } from './environments';
import { RabbitChannelsEnum } from './coupons/enum';
import { MigrationModule } from '@pe/migration-kit';

@Module({
  imports: [
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
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    RabbitMqModule.forRoot(environment.rabbitmq),
    CommandModule,

    SubscriptionsSdkModule.forRoot({
      channel: RabbitChannelsEnum.Coupons,
      features: [],
      microservice: 'coupons',
    }),
    ChannelsModule.forRoot({
      channel: RabbitChannelsEnum.Coupons,
      channelSetPerSubscription: ChannelSetPerSubscription.ManyToOne,
      microservice: 'coupons',
    }),
    CouponsModule,
    MigrationModule,
  ],
})
export class ApplicationModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
