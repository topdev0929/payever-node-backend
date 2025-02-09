import { HttpModule, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaSdkModule } from '@pe/media-sdk';
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
import { AsyncEncoderModule } from './async-encoder';
import { environment } from './environments';
import { MediaHttpModule } from './http/media-http.module';
import { MediaModule } from './media';
import { MigrationModule } from '@pe/migration-kit';

@Module({
  imports: [
    JwtAuthModule.forRoot(environment.jwtOptions),
    RedisModule.forRoot(environment.redis),
    HttpModule,
    CommandModule,
    EventDispatcherModule,
    MediaSdkModule,
    MediaModule,
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
    ApmModule.forRoot(
      environment.apm.enable,
      environment.apm.options,
    ),
    RabbitMqModule.forRoot(environment.rabbitmq),
    MediaHttpModule,
    AsyncEncoderModule,
    MigrationModule.forRoot({}),
  ],
})

export class ApplicationModule implements NestModule {
  public configure(): void { }
}
