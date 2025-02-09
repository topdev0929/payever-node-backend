import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandModule, DefaultMongooseConfig, JwtAuthModule, RabbitMqModule, RedisModule } from '@pe/nest-kit';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { CronModule } from '@pe/cron-kit';
import { SubscriptionsSdkModule } from '@pe/subscriptions-sdk/modules';
import { environment } from './environments';
import { StudioModule } from './studio';
import { BusinessModule } from './business/business.module';
import { SampleDataModule } from './sample-data/sample-data.module';
import { MigrationModule } from '@pe/migration-kit';
import { WebsocketsModule } from './websockets';
import * as dotenv from 'dotenv';
import { ApplicationBuilderThemeModule } from './application-builder-theme';

dotenv.config();

let loadModules: any[] = [];

switch (true) {
  case process.env.POD === 'http':
    loadModules = loadModules.concat(
      [
        HttpModule,
        CommandModule,
        JwtAuthModule.forRoot(environment.jwtOptions),
        RedisModule.forRoot(environment.redis),
        MongooseModule.forRoot(
          environment.mongodb,
          DefaultMongooseConfig,
        ),
        StudioModule,
        SampleDataModule,
        RabbitMqModule.forRoot(environment.rabbitmq),
        SubscriptionsSdkModule.forRoot({
          channel: 'async_events_studio_micro',
          features: [{
            allowedValues: ['free', 'essential', 'premium', 'pro'],
            name: 'type',
            type: String,
          }],
          microservice: 'studio',
        }),
        ApplicationBuilderThemeModule,
      ],
    );
    break;
  case process.env.POD === 'consumer':
    loadModules = loadModules.concat(
      [
        CommandModule,
        JwtAuthModule.forRoot(environment.jwtOptions),
        MongooseModule.forRoot(
          environment.mongodb,
          DefaultMongooseConfig,
        ),
        StudioModule,
        RabbitMqModule.forRoot(environment.rabbitmq),
        RedisModule.forRoot(environment.redis),
        SubscriptionsSdkModule.forRoot({
          channel: 'async_events_studio_micro',
          features: [{
            allowedValues: ['free', 'essential', 'premium', 'pro'],
            name: 'type',
            type: String,
          }],
          microservice: 'studio',
        }),
        ApplicationBuilderThemeModule,
      ],
    );
    break;
  case process.env.POD === 'cron':
    loadModules = loadModules.concat(
      [
        MongooseModule.forRoot(
          environment.mongodb,
          DefaultMongooseConfig,
        ),
        RedisModule.forRoot(environment.redis),
        RabbitMqModule.forRoot(environment.rabbitmq),
        JwtAuthModule.forRoot(environment.jwtOptions),
        CronModule,
        StudioModule,

        // SubscriptionsSdkModule.forRoot({
        //   channel: 'async_events_studio_micro',
        //   features: [{
        //     allowedValues: ['free', 'essential', 'premium', 'pro'],
        //     name: 'type',
        //     type: String,
        //   }],
        //   microservice: 'studio',
        // }),
      ],
    );
    break;
  case process.env.POD === 'ws':
    loadModules = loadModules.concat(
      [
        RedisModule.forRoot(environment.redis),
        RabbitMqModule.forRoot(environment.rabbitmq),
        JwtAuthModule.forRoot(environment.jwtOptions),
        MongooseModule.forRoot(
          environment.mongodb,
          DefaultMongooseConfig,
        ),
        SubscriptionsSdkModule.forRoot({
          channel: 'async_events_studio_micro',
          features: [{
            allowedValues: ['free', 'essential', 'premium', 'pro'],
            name: 'type',
            type: String,
          }],
          microservice: 'studio',
        }),
        WebsocketsModule,
      ],
    );
    break;
  default:
    loadModules = loadModules.concat(
      [
        HttpModule,
        CommandModule,
        CronModule,
        MigrationModule,
        JwtAuthModule.forRoot(environment.jwtOptions),
        RedisModule.forRoot(environment.redis),
        MongooseModule.forRoot(
          environment.mongodb,
          DefaultMongooseConfig,
        ),
        StudioModule,
        BusinessModule,
        SampleDataModule,
        RabbitMqModule.forRoot(environment.rabbitmq),
        SubscriptionsSdkModule.forRoot({
          channel: 'async_events_studio_micro',
          features: [{
            allowedValues: ['free', 'essential', 'premium', 'pro'],
            name: 'type',
            type: String,
          }],
          microservice: 'studio',
        }),
        WebsocketsModule,
        ApplicationBuilderThemeModule,
      ],
    );
    break;
}

@Module({
  imports: [
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    ...loadModules,
  ],
})
export class AppModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
