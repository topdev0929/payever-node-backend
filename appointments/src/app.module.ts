import { Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  CommandModule,
  DefaultMongooseConfig,
  EventDispatcherModule,
  JwtAuthModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { CommonSdkModule } from '@pe/common-sdk';
import { ElasticSearchModule } from '@pe/elastic-kit';
import { GraphQLModule } from '@nestjs/graphql';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { AppointmentModule } from './appointments';
import { AppointmentNetworkModule } from './appointment-network';
import { environment } from './environments';
import { FiltersConfig } from './appointments/config';
import { RabbitChannelsEnum } from './appointments/enums';

@Module({
  imports: [
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
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      // context: ({ req }: { req: any }): { req: any } => ({ req }),
      path: '/appointments',
      // formatError: GqlErrorFormatter,
      playground: true,
    }),
    CommonSdkModule.forRoot({
      channel: RabbitChannelsEnum.Appointments,
      consumerModels: [],
      filters: FiltersConfig,
      rsaPath: environment.rsa,
    }),
    // Local modules
    AppointmentModule,
    AppointmentNetworkModule,
  ],
})
export class AppModule implements NestModule {
  public configure(): void { }
}
