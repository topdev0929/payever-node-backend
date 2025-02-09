import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandModule, DefaultMongooseConfig, RabbitMqModule, RedisModule } from '@pe/nest-kit';
import { JwtAuthModule } from '@pe/nest-kit/modules/auth';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { environment } from './environments';
import { ProxyModule } from './proxy/proxy.module';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { MigrationModule } from '@pe/migration-kit/module/migration.module';

@Module({
  controllers: [],
  imports: [
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    JwtAuthModule.forRoot(environment.jwtOptions),
    RedisModule.forRoot(environment.redis),
    MigrationModule,
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    CommandModule,
    RabbitMqModule.forRoot(environment.rabbitmq),
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),

    ProxyModule.forRoot({ env: process.env}),
  ],
  providers: [ ],
})
export class AppModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
