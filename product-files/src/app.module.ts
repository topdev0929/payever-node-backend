import { HttpModule, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessModule } from '@pe/business-kit';
import {
  ApmModule,
  CommandModule,
  DefaultMongooseConfig,
  EventDispatcherModule,
  JwtAuthModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { DiscoveryModule } from '@pe/nest-kit/modules/discovery';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { BusinessSchema, BusinessSchemaName } from './business/schemas';
import { environment } from './environments';
import { FileImportsModule } from './file-imports/file-imports.module';
import { MigrationModule } from '@pe/migration-kit';

@Module({
  imports: [
    HttpModule,
    BusinessModule,
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    MongooseModule.forFeature([
      { name: BusinessSchemaName, schema: BusinessSchema },
    ]),
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    ApmModule.forRoot(
      environment.apm.enable,
      environment.apm.options,
    ),
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),    
    CommandModule,
    RabbitMqModule.forRoot(environment.rabbitmq),
    RedisModule.forRoot(environment.redis),
    JwtAuthModule.forRoot(environment.jwtOptions),    
    FileImportsModule,
    DiscoveryModule,
    EventDispatcherModule,
    MigrationModule.forRoot({ }),
  ],
})
export class AppModule implements NestModule {
  public configure(): any { }
}
