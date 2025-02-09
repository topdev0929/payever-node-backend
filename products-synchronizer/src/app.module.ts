import {
  HttpException,
  HttpModule,
  InternalServerErrorException,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ApmModule,
  CommandModule,
  DefaultMongooseConfig,
  EventDispatcherModule,
  ErrorHandlersEnum,
  ErrorsHandlerModule,
  JwtAuthModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { BusinessModule } from '@pe/business-kit';
import { environment, RabbitChannelEnum } from './environments';
import { IntegrationModule } from '@pe/synchronizer-kit';
import { SynchronizerModule } from './synchronizer/synchronizer.module';

@Module({
  imports: [
    HttpModule,
    CommandModule,
    BusinessModule.forRoot({
      customSchema: null,
      rabbitChannel: RabbitChannelEnum.Synchronizer,
    }),
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
    ApmModule.forRoot(
      environment.apm.enable,
      environment.apm.options,
    ),
    ErrorsHandlerModule.forRoot([
      {
        exceptions: [HttpException],
        name: ErrorHandlersEnum.defaultHttp,
      },
      {
        exceptions: [InternalServerErrorException],
        name: ErrorHandlersEnum.runtimeException,
      },
    ]),
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    EventDispatcherModule,
    RabbitMqModule.forRoot(environment.rabbitmq),
    SynchronizerModule.forRoot(),
    BusinessModule,
  ],
})
export class AppModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
