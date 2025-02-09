import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ApmModule,
  CommandModule,
  DefaultMongooseConfig,
  ErrorHandlersEnum,
  ErrorsHandlerModule,
  EventDispatcherModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { JwtAuthModule } from '@pe/nest-kit/modules/auth';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { Error } from 'mongoose';
import { environment } from './environments';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { MigrationModule } from '@pe/migration-kit';
import { ChannelSetPerSubscription, ChannelsModule } from '@pe/channels-sdk';
import { RabbitChannelsEnum } from './marketplace/enums';

@Module({
  controllers: [],
  imports: [
    HttpModule,
    CommandModule,
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
    ErrorsHandlerModule.forRoot([
      {
        exceptions: [Error.ValidationError],
        name: ErrorHandlersEnum.uniqueEntity,
      },
    ]),
    EventDispatcherModule,
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    RabbitMqModule.forRoot(environment.rabbitmq),
    HttpModule,
    MarketplaceModule,
    MigrationModule,
    ChannelsModule.forRoot({
      channel: RabbitChannelsEnum.Marketplace,
      channelSetPerSubscription: ChannelSetPerSubscription.OneToOne,
      microservice: 'marketplace',
    }),
  ],
  providers: [],
})

export class ApplicationModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
