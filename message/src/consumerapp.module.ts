import { Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import {
  DefaultMongooseConfig,
  EventDispatcherModule,
  RabbitMqModule,
} from '@pe/nest-kit';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { MigrationModule } from '@pe/migration-kit';

import { environment } from './environments';

import { MessagesConsumerModule } from './consumer/consumer.module';
import { LocalStompModule } from './stomp.module';
import { ApplicationBuilderThemeModule } from './application-builder-theme';

@Module({
  imports: [
    EventDispatcherModule,
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    RabbitMqModule.forRoot(environment.rabbitmq),
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    LocalStompModule,
    MessagesConsumerModule,
    MigrationModule,
    ApplicationBuilderThemeModule,
  ],
})
export class ConsumerAppModule implements NestModule {
  public configure(): void { }
}
