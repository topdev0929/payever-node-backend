import {
  BadRequestException,
  HttpException,
  HttpModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelSetPerSubscription, ChannelsModule } from '@pe/channels-sdk';
import { CommandModule, DefaultMongooseConfig, EventDispatcherModule, RabbitMqModule, RedisModule } from '@pe/nest-kit';
import { ApmModule } from '@pe/nest-kit/modules/apm';
import { JwtAuthModule } from '@pe/nest-kit/modules/auth';
import { ErrorHandlersEnum, ErrorsHandlerModule } from '@pe/nest-kit/modules/errors-handler';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { Error } from 'mongoose';
import { BusinessModuleLocal } from './business';
import { AdminChannelModule } from './channel';
import { environment } from './environments';
import { MessageBusChannelsEnum } from './business/enums';
import { MigrationModule } from '@pe/migration-kit';

@Module({
  imports: [
    HttpModule,
    CommandModule,
    JwtAuthModule.forRoot(environment.jwtOptions),
    RedisModule.forRoot(environment.redis),
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
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
    EventDispatcherModule,
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    RabbitMqModule.forRoot(environment.rabbitmq),
    ApmModule.forRoot(
      environment.apm.enable,
      environment.apm.options,
    ),
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    BusinessModuleLocal,
    ChannelsModule.forRoot({
      channel: MessageBusChannelsEnum.channels,
      channelSetPerSubscription: ChannelSetPerSubscription.ManyToOne,
      microservice: 'connect',
    }),
    AdminChannelModule,
    MigrationModule.forRoot({ }),
  ],
})
export class ApplicationModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
