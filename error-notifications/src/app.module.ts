import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ApmModule,
  CommandModule,
  DefaultMongooseConfig,
  EventDispatcherModule,
  RabbitMqModule,
  JwtAuthModule,
  RedisModule,
} from '@pe/nest-kit';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { environment } from './environments';
import { ErrorNotificationsModule } from './error-notifications/error-notifications.module';
import { MigrationModule } from '@pe/migration-kit/module/migration.module';
import { MutexModule } from '@pe/nest-kit/modules/mutex';

@Module({
  imports: [
    ApmModule.forRoot(
      environment.apm.enable,
      environment.apm.options,
    ),
    CommandModule,
    MigrationModule,
    EventDispatcherModule,
    JwtAuthModule.forRoot(environment.jwtOptions),
    RedisModule.forRoot(environment.redis),
    RabbitMqModule.forRoot(environment.rabbitmq),
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

    ErrorNotificationsModule,
    MutexModule,
  ],
  providers: [],
})
export class AppModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
