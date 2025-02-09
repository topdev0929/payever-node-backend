import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelSetPerSubscription, ChannelsModule } from '@pe/channels-sdk';
import {
  ApmModule,
  CommandModule,
  DefaultMongooseConfig,
  EventDispatcherModule,
  JwtAuthModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { BusinessModule } from './business/business.module';
import { environment, MessageBusChannelsEnum } from './environments';
import { PluginModule } from './plugin/plugin.module';
import { MigrationModule } from '@pe/migration-kit';

@Module({
  imports: [
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    JwtAuthModule.forRoot(environment.jwtOptions),
    RedisModule.forRoot(environment.redis),
    HttpModule,
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    RabbitMqModule.forRoot(environment.rabbitmq),
    ApmModule.forRoot(
      environment.apm.enable,
      environment.apm.options,
    ),
    CommandModule,
    EventDispatcherModule,
    ChannelsModule.forRoot({
      channel: MessageBusChannelsEnum.plugins,
      channelSetPerSubscription: ChannelSetPerSubscription.OneToOne,
      microservice: 'plugins',
    }),
    BusinessModule,
    PluginModule,
    MigrationModule,
  ],
})
export class ApplicationModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void { }
}
