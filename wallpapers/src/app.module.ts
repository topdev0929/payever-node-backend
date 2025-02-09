import {
  BadRequestException,
  HttpException,
  HttpModule,
  MiddlewareConsumer,
  Module,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CommandModule,
  DefaultMongooseConfig,
  JwtAuthModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { ApmModule } from '@pe/nest-kit/modules/apm';
import {
  ErrorHandlersEnum,
  ErrorsHandlerModule,
} from '@pe/nest-kit/modules/errors-handler';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { Error } from 'mongoose';

import { environment } from './environments';
import { WallpapersModule } from './wallpapers/wallpapers.module';

import { MigrationModule } from '@pe/migration-kit/module/migration.module';

@Module({
  imports: [
    HttpModule,
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
    MongooseModule.forRoot(environment.mongodb, DefaultMongooseConfig),
    WallpapersModule,
    JwtAuthModule.forRoot(environment.jwtOptions),
    RedisModule.forRoot(environment.redis),
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    ApmModule.forRoot(environment.apm.enable, environment.apm.options),
    RabbitMqModule.forRoot(environment.rabbitmq),
    CommandModule,
    MigrationModule,
  ],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer): void {}
}
