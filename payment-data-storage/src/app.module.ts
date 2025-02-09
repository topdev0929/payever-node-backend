import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CronModule } from '@pe/cron-kit';
import {
  ApmModule,
  CommandModule,
  DefaultMongooseConfig,
  EventDispatcherModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { JwtAuthModule } from '@pe/nest-kit/modules/auth';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { MutexModule } from '@pe/nest-kit/modules/mutex';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { environment } from './environments';
import { StorageModule } from './storage/storage.module';
import { MigrationModule } from '@pe/migration-kit';

@Module({
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
    RabbitMqModule.forRoot(environment.rabbitmq),
    EventDispatcherModule,
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    MutexModule,
    CronModule,
    StorageModule,
    MigrationModule.forRoot({}),
  ],
})
export class ApplicationModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
