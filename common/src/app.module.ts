import { Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApmModule } from '@pe/nest-kit/modules/apm';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { environment } from './environments';
import { CommonModule } from './common/common.module';
import { CommandModule, DefaultMongooseConfig, RabbitMqModule, RedisModule, JwtAuthModule } from '@pe/nest-kit';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { AdminModule } from './admin/admin.module';
import { MigrationModule } from '@pe/migration-kit';

@Module({
  imports: [
    AdminModule,
    ApmModule.forRoot(
      environment.apm.enable,
      environment.apm.options,
      ),
    CommandModule,
    CommonModule,
    JwtAuthModule.forRoot(environment.jwtOptions),
    RedisModule.forRoot(environment.redis),
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    RabbitMqModule.forRoot(environment.rabbitmq),
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    MigrationModule.forRoot({ }),
  ],
})
export class ApplicationModule implements NestModule {
  public configure(): void { }
}
