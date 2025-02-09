import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApmModule } from '@pe/nest-kit/modules/apm';
import { JwtAuthModule } from '@pe/nest-kit/modules/auth';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { CommandModule, DefaultMongooseConfig, RabbitMqModule, RedisModule } from '@pe/nest-kit';
import { EventDispatcherModule } from '@pe/nest-kit/modules/event-dispatcher';
import { environment } from './environments';
import { ApplicationSchema, ApplicationSchemaName, BuilderApplicationModule } from './builder';
import { CronModule } from '@pe/cron-kit';
import { BuilderModule } from '@pe/builder-kit';
import { PodTypesEnum } from '@pe/builder-kit/module/common/enums/pod-types.enum';
import { MigrationModule } from '@pe/migration-kit';

const imports: any[] = [
  RedisModule.forRoot(environment.redis),
  NestKitLoggingModule.forRoot({
    applicationName: environment.applicationName,
    isProduction: environment.production,
  }),
  JwtAuthModule.forRoot(environment.jwtOptions),
  HttpModule,
  StatusModule.forRoot({
    mongodbUrl: environment.mongodb,
    sideAppPort: environment.statusPort,
  }),
  ApmModule.forRoot(environment.apm.enable, environment.apm.options),
  MongooseModule.forRoot(environment.mongodb, DefaultMongooseConfig),
  EventDispatcherModule,
  RabbitMqModule.forRoot(environment.rabbitmq),
  CommandModule,
  BuilderModule.forRoot({
    applicationSchema: ApplicationSchema,
    applicationSchemaName: ApplicationSchemaName,
    applicationType: environment.applicationType,
    builderWsMicro: environment.wsUrl,
    elasticEnv: environment.elasticEnv,
    jwtSecret: environment.jwtOptions.secret,
    pod: process.env.pod ? process.env.pod as any : PodTypesEnum.http,
    rabbitConfig: {
      consumer: {
        exchange: 'async_events',
        rabbitChannel: environment.rabbitChannel,
      },
      documentConsumer: {
        exchange: environment.rabbitExchangeFolder,
        rabbitChannel: environment.rabbitChannelFolder,
      },
      exportConsumer: {
        exchange: environment.rabbitExchangeFolderExport,
        rabbitChannel: environment.rabbitChannelFolderExport,
      },
    },
    redisConfig: environment.redis,
  }),
  CronModule,
  MigrationModule,
];

if (!process.env.pod || process.env.pod !== 'cron') {
  imports.push(BuilderApplicationModule);
}

// todo: need update with flattening
// if (['application', ApplicationTypesEnum.Studio].includes(environment.applicationType)) {
//   imports.push(CompilerModule);
// }

@Module({
  imports: imports,
})
export class ApplicationModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
