import { BadRequestException, HttpException, HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandModule, DefaultMongooseConfig, EventDispatcherModule, RabbitMqModule, RedisModule } from '@pe/nest-kit';
import { ApmModule } from '@pe/nest-kit/modules/apm';
import { JwtAuthModule } from '@pe/nest-kit/modules/auth';
import { ErrorHandlersEnum, ErrorsHandlerModule } from '@pe/nest-kit/modules/errors-handler';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { Error } from 'mongoose';
import { BusinessModule } from './business';
import { environment } from './environments';
import { InventoryModule } from './inventory/inventory.module';
import { MigrationModule } from '@pe/migration-kit/module/migration.module';


@Module({
  imports: [
    HttpModule,
    CommandModule,
    JwtAuthModule.forRoot(environment.jwtOptions),
    RedisModule.forRoot(environment.redis),
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    ApmModule.forRoot(
      environment.apm.enable,
      environment.apm.options,
    ),
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    ErrorsHandlerModule.forRoot([
      {
        exceptions: [BadRequestException],
        name: ErrorHandlersEnum.dtoValidation,
      },
      {
        exceptions: [Error.ValidationError],
        name: ErrorHandlersEnum.uniqueEntity,
      },
      {
        exceptions: [HttpException],
        name: ErrorHandlersEnum.runtimeException,
      },
    ]),
    EventDispatcherModule,
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    RabbitMqModule.forRoot(environment.rabbitmq),
    BusinessModule,
    InventoryModule,
    MigrationModule.forRoot({ }),
  ],
})
export class ApplicationModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
