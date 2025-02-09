import { BadRequestException, HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ApmModule,
  CommandModule,
  DefaultMongooseConfig,
  EventDispatcherModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { JwtAuthModule } from '@pe/nest-kit/modules/auth';
import { ErrorHandlersEnum, ErrorsHandlerModule } from '@pe/nest-kit/modules/errors-handler';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';

import { Error } from 'mongoose';
import { environment } from './environments';
import { SocialModule } from './social';
import { WSModule } from './ws/ws.module';
import { MigrationModule } from '@pe/migration-kit';

@Module({
  imports: [
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    JwtAuthModule.forRoot(environment.jwtOptions),
    RedisModule.forRoot(environment.redis),
    ErrorsHandlerModule.forRoot([{
      exceptions: [BadRequestException],
      name: ErrorHandlersEnum.dtoValidation,
    }, {
      exceptions: [Error.ValidationError],
      name: ErrorHandlersEnum.uniqueEntity,
    }]),
    HttpModule,
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    ApmModule.forRoot(
      environment.apm.enable,
      environment.apm.options,
    ),
    RabbitMqModule.forRoot(environment.rabbitmq),
    CommandModule,
    EventDispatcherModule,
    SocialModule,
    WSModule,
    MigrationModule.forRoot({ }),
  ],
})

export class ApplicationModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
