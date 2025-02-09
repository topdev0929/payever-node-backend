import { Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import {
  CommandModule,
  DefaultMongooseConfig,
  EventDispatcherModule,
  JwtAuthModule,
  RabbitMqModule,
} from '@pe/nest-kit';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { MigrationModule } from '@pe/migration-kit';

import { environment } from './environments';

import { MessagesHttpModule } from './http/http.module';
import { LocalStompModule } from './stomp.module';
import { ThemeModule } from './themes';
import { ContentModule } from './contents';
import { ApplicationBuilderThemeModule } from './application-builder-theme';

const imports: any[] = [
  CommandModule,
  EventDispatcherModule,
  MongooseModule.forRoot(
    environment.mongodb,
    DefaultMongooseConfig,
  ),
  JwtAuthModule.forRoot(environment.jwtOptions),
  RabbitMqModule.forRoot(environment.rabbitmq),
  NestKitLoggingModule.forRoot({
    applicationName: environment.applicationName,
    isProduction: environment.production,
  }),
  LocalStompModule,
  MessagesHttpModule,
  ThemeModule,
  MigrationModule,
  ContentModule,
  ApplicationBuilderThemeModule,
];

if (!environment.pact) {
  imports.push(
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
  );
}

@Module({
  imports,
})
export class HttpAppModule implements NestModule {
  public configure(): void { }
}
