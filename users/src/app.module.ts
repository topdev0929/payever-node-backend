import {
  BadRequestException,
  HttpException,
  HttpModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  NotFoundException,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Error } from 'mongoose';

import { ElasticSearchModule } from '@pe/elastic-kit';
import {
  CollectorModule,
  DefaultMongooseConfig,
  EventDispatcherModule,
  JwtAuthModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { ApmModule } from '@pe/nest-kit/modules/apm';
import { CommandModule } from '@pe/nest-kit/modules/command';
import { ErrorHandlersEnum, ErrorsHandlerModule } from '@pe/nest-kit/modules/errors-handler';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { CustomAccessModule } from './custom-access/custom-access.module';
import { environment } from './environments';
import { LegalDocumentModule } from './legal-document';
import { UserModule } from './user';
import { MigrationModule } from '@pe/migration-kit';
import { CronModule } from '@pe/cron-kit';

@Module({
  imports: [
    ElasticSearchModule.forRoot({
      authPassword: environment.elasticEnv.elasticSearchAuthPassword,
      authUsername: environment.elasticEnv.elasticSearchAuthUsername,
      cloudId: environment.elasticEnv.elasticSearchCloudId,
      host: environment.elasticEnv.elasticSearchHost,
    }),
    RedisModule.forRoot(environment.redis),
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    HttpModule,
    CommandModule,
    EventDispatcherModule,
    ErrorsHandlerModule.forRoot([
      {
        exceptions: [BadRequestException],
        name: ErrorHandlersEnum.dtoValidation,
      },
      {
        exceptions: [NotFoundException],
        name: 'forbidden.handler',
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
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    UserModule,
    CronModule,
    CustomAccessModule,
    LegalDocumentModule,
    ApmModule.forRoot(
      environment.apm.enable,
      environment.apm.options,
    ),
    JwtAuthModule.forRoot(environment.jwtOptions),
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    RabbitMqModule.forRoot(environment.rabbitmq),
    CollectorModule,
    MigrationModule,
  ],
})
export class AppModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
