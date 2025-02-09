import { BadRequestException, HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CronModule } from '@pe/cron-kit';
import {
  CommandModule,
  DefaultMongooseConfig,
  ErrorHandlersEnum,
  ErrorsHandlerModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { ApmModule } from '@pe/nest-kit/modules/apm';
import { JwtAuthModule } from '@pe/nest-kit/modules/auth';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { NotificationsSdkModule } from '@pe/notifications-sdk';
import { Error } from 'mongoose';
import { environment } from './environments';
import { NotificationsModule } from './notifications/notifications.module';
import { TestModule } from './test-module';
import { MigrationModule } from '@pe/migration-kit';

@Module({
  imports: [
    HttpModule,
    CommandModule,
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
    NotificationsModule,
    NotificationsSdkModule,
    TestModule,
    RabbitMqModule.forRoot(environment.rabbitmq),
    CronModule,
    MigrationModule.forRoot({ }),
  ],
})

export class ApplicationModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
