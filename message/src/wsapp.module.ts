import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import {
  EventDispatcherModule,
  DefaultMongooseConfig,
  RabbitMqModule,
  JwtAuthModule,
} from '@pe/nest-kit';
import { StatusModule } from '@pe/nest-kit/modules/status';

import { environment } from './environments';
import { WsModule } from './ws/ws.module';
import { LocalStompModule } from './stomp.module';
import { MigrationModule } from '@pe/migration-kit';

@Module({
  imports: [
    EventDispatcherModule,
    JwtAuthModule.forRoot(environment.jwtOptions),
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
    LocalStompModule,
    WsModule,
    MigrationModule,
  ],
  providers: [],
})
export class WsAppModule { }
