import { HttpModule, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  ApmModule,
  CommandModule,
  DefaultMongooseConfig,
  EventDispatcherModule,
  JwtAuthModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { MigrationModule } from '@pe/migration-kit';

import { AppsModule } from './apps';
import { environment } from './environments';

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
    RabbitMqModule.forRoot(environment.rabbitmq),
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    EventDispatcherModule,
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    ApmModule.forRoot(environment.apm.enable, environment.apm.options),
    MigrationModule,
    //
    AppsModule,
  ],
})
export class ApplicationModule implements NestModule {
  public configure(): void { }
}
