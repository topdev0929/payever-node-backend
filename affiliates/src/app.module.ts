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
import { BusinessModule } from '@pe/business-kit';
import { Error } from 'mongoose';
import { environment } from './environments';
import { AffiliatesModule } from './affiliates/affiliates.module';
import { EntityExistsException } from './exceptions';
import { RabbitChannelsEnum } from './affiliates/enums';
import { MigrationModule } from '@pe/migration-kit';

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
      {
        exceptions: [EntityExistsException],
        name: 'dto-validation',
      },
    ]),
    EventDispatcherModule,
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    RabbitMqModule.forRoot(environment.rabbitmq),

    AffiliatesModule,
    BusinessModule.forRoot({
      customSchema: null,
      rabbitChannel: RabbitChannelsEnum.Affiliates,
    }),
    MigrationModule.forRoot({ }),
  ],
  providers: [],
})

export class ApplicationModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
