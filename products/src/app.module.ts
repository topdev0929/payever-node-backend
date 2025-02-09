import { BadRequestException, forwardRef, HttpException, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Error } from 'mongoose';

import { ElasticSearchModule } from '@pe/elastic-kit';
import { MediaSdkModule } from '@pe/media-sdk';
import {
  ApmModule,
  CollectorModule,
  CommandModule,
  DefaultMongooseConfig,
  ErrorHandlersEnum,
  ErrorsHandlerModule,
  EventDispatcherModule,
  JwtAuthModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { MigrationModule } from '@pe/migration-kit';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { MutexModule } from '@pe/nest-kit/modules/mutex';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { AlbumModule } from './album/album.module';
import { BusinessModule } from './business/business.module';
import { CategoriesModule } from './categories/categories.module';
import { ChannelSetModule } from './channel-set/channel-set.module';
import { MarketPlaceModule } from './marketplace';
import { NewProductsModule } from './new-products/new-products.module';
import { ProductsModule } from './products';
import { SampleProductsModule } from './sample-products';
import { environment } from './environments';
import { FolderModule } from './folder';

@Module({
  imports: [
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    JwtAuthModule.forRoot(environment.jwtOptions),
    RedisModule.forRoot(environment.redis),
    ProductsModule.forRoot(),
    forwardRef(() => AlbumModule),
    ChannelSetModule,
    CommandModule,
    forwardRef(() => MarketPlaceModule),
    ElasticSearchModule.forRoot({
      authPassword: environment.elasticSearchAuthPassword,
      authUsername: environment.elasticSearchAuthUsername,
      cloudId: environment.elasticSearchCloudId,
      host: environment.elasticSearchHost,
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
        name: ErrorHandlersEnum.defaultHttp,
      },
    ]),
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    StatusModule.forRoot({
      sideAppPort: environment.statusPort,
    }),
    (environment.cucumberTest ? ApmModule : ApmModule.forRoot(environment.apm.enable, { ...environment.apm.options })),
    RabbitMqModule.forRoot(environment.rabbitmq),
    EventDispatcherModule,
    MutexModule,
    MediaSdkModule,
    MigrationModule,
    FolderModule,
    BusinessModule,
    CategoriesModule,
    NewProductsModule,
    CollectorModule,
    SampleProductsModule,
  ],
})
export class AppModule implements NestModule {
  public configure(): void { }
}
