import {
  HttpException,
  HttpModule,
  InternalServerErrorException,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  ApmModule,
  CommandModule,
  DefaultMongooseConfig,
  EventDispatcherModule,
  ErrorHandlersEnum,
  ErrorsHandlerModule,
  JwtAuthModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { BusinessModule } from '@pe/business-kit';
import { IntegrationModule } from '@pe/synchronizer-kit';
import { SynchronizerModule } from './synchronizer';
import { environment } from './environments';
import { ThirdPartyModule } from './third-party/third-party.module';
import { RabbitChannelsEnum } from './synchronizer/enums';
import { FilesModule } from './files/files.module';
import { ContactsModule } from './contacts/contacts.module';
import { MerchantModule } from './merchant/merchant.module';

@Module({
  imports: [
    HttpModule,
    CommandModule,
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
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
    ErrorsHandlerModule.forRoot([
      {
        exceptions: [HttpException],
        name: ErrorHandlersEnum.defaultHttp,
      },
      {
        exceptions: [InternalServerErrorException],
        name: ErrorHandlersEnum.runtimeException,
      },
    ]),
    StatusModule.forRoot({
      sideAppPort: environment.statusPort,
    }),
    EventDispatcherModule,
    RabbitMqModule.forRoot(environment.rabbitmq),
    BusinessModule.forRoot({
      rabbitChannel: RabbitChannelsEnum.ContactsSynchronizerMicro,
    }),
    IntegrationModule,
    
    SynchronizerModule,
    ThirdPartyModule,
    FilesModule,
    ContactsModule,
    MerchantModule,
  ],
})
export class AppModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
