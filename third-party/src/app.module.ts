import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { ThirdPartyModule } from '@pe/third-party-sdk';

import { AccountingsModule } from './accountings/accountings.module';
import { BusinessModule } from './business/business.module';
import { CommunicationsModule } from './communications/communications.module';
import { environment } from './environments';
import { PaymentsModule } from './payments/payments.module';
import { PluginsModule } from './plugins/plugins.module';
import { ProductsModule } from './products/products.module';
import { ShippingModule } from './shipping/shipping.module';
import { IntegrationModule } from './third-party/integration.module';
import { MigrationModule } from '@pe/migration-kit';

@Module({
  imports: [
    HttpModule,
    CommandModule,
    EventDispatcherModule,
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    JwtAuthModule.forRoot(environment.jwtOptions),
    RedisModule.forRoot(environment.redis),
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    RabbitMqModule.forRoot(environment.rabbitmq),
    ApmModule.forRoot(
      environment.apm.enable,
      environment.apm.options,
    ),
    AccountingsModule,
    BusinessModule,
    CommunicationsModule,
    PaymentsModule,
    PluginsModule,
    ProductsModule,
    ShippingModule,
    IntegrationModule,
    ThirdPartyModule.forRoot({
      env: process.env,
    }),
    MigrationModule.forRoot({ }),
  ],
})
export class ApplicationModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
