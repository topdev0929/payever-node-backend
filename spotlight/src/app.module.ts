import { Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import {
  CommandModule,
  DefaultMongooseConfig,
  EventDispatcherModule,
  JwtAuthModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { ElasticSearchModule } from '@pe/elastic-kit';
import { SpotlightModule } from './spotlight';
import { environment } from './environments';
import { MigrationModule } from '@pe/migration-kit/module/migration.module';

const imports: any[] = [
  CommandModule,
  ElasticSearchModule.forRoot({
    authPassword: environment.elastic.password,
    authUsername: environment.elastic.username,
    cloudId: environment.elastic.cloudId,
    host: environment.elastic.host,
  }),
  EventDispatcherModule,
  MongooseModule.forRoot(
    environment.mongodb,
    DefaultMongooseConfig,
  ),
  JwtAuthModule.forRoot(environment.jwtOptions),
  RabbitMqModule.forRoot(environment.rabbitmq),
  RedisModule.forRoot(environment.redis),
  NestKitLoggingModule.forRoot({
    applicationName: environment.applicationName,
    isProduction: environment.production,
  }),
  SpotlightModule,
  MigrationModule,
];

if (!environment.pact) {
  imports.push(
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    })
  );
}

@Module({
  imports,
})
export class AppModule implements NestModule {
  public configure(): void { }
}
