import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ApmModule,
  CommandModule,
  DefaultMongooseConfig,
  EventDispatcherModule,
  JwtAuthModule,
  MutexModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { environment } from './environments';
import { PaymentNotificationsModule } from './payment-notifications/payment-notifications.module';
import { MigrationModule } from '@pe/migration-kit';
@Module({
  imports: [
    ApmModule.forRoot(
      environment.apm.enable,
      environment.apm.options,
    ),
    MigrationModule,
    CommandModule,
    EventDispatcherModule,
    RabbitMqModule.forRoot(environment.rabbitmq),
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
    MutexModule,

    PaymentNotificationsModule.forRoot(),
  ],
  providers: [],
})
export class AppModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
