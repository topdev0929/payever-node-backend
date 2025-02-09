import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MediaSdkModule } from '@pe/media-sdk';
import { EventDispatcherModule } from '@pe/nest-kit';
import { BusinessModule } from '@pe/business-kit';
import { FoldersPluginModule } from '@pe/folders-plugin';
import {
  CheckAssignedImagesCommand,
  ExportBusinessWallpaperCommand,
  RequestAdditionalImagesCommand,
  SetupDefaultFoldersCommand,
  UploadWallpapersCommand,
} from './command';
import {
  AdminBusinessProductsController,
  AdminBusinessWallpapersController,
  AdminUserProductsController,
  AdminUserWallpapersController,
  BusinessController,
  BusinessProductsController,
  UserController,
  UserProductsController,
} from './controllers';
import { BusinessEventListener, BusinessWallpaperEventListner, UserWallpaperEventListner } from './event-listener';
import { BusinessWallpaperMessagesProducer } from './producers';
import {
  BusinessProductIndustrySchema,
  BusinessProductIndustrySchemaName,
  BusinessProductSchema,
  BusinessProductSchemaName,
  BusinessWallpapersSchema,
  BusinessWallpapersSchemaName,
  CountryCityWallpapersSchema,
  CountryCityWallpapersSchemaName,
  UserProductIndustrySchema,
  UserProductIndustrySchemaName,
  UserProductSchema,
  UserProductSchemaName,
  UserWallpapersSchema,
  UserWallpapersSchemaName,
} from './schemas';
import {
  BusinessProductsService,
  BusinessWallpapersService,
  CountryCityWallpapersService,
  CountryCityWallpapersUploader,
  CountryInfoService,
  DropboxClient,
  ImageProcessor,
  MediaServiceClient,
  ProductWallpaperFilterByIndustryService,
  ProductWallpaperFilterByNameService,
  ProductWallpaperFilterCollector,
  UserProductsService,
  UserWallpapersService,
} from './services';
import { environment } from '../environments';
import { ConditionsService, RuleActionEnum, RulesConditionDataTypeEnum, RulesSdkModule } from '@pe/rules-sdk';
import { RabbitChannelsEnum, RabbitExchangesEnum } from './enum';
import { FilterOptionTypeEnum, FiltersService } from '@pe/common-sdk';
import { UserConsumer, WallpaperConsumer } from './consumers';

@Module({
  controllers: [
    AdminBusinessProductsController,
    AdminBusinessWallpapersController,
    AdminUserProductsController,
    AdminUserWallpapersController,
    BusinessController,
    BusinessProductsController,
    UserController,
    UserProductsController,
    WallpaperConsumer,
    UserConsumer,
  ],
  imports: [
    HttpModule,
    BusinessModule.forRoot({
      customSchema: null,
      rabbitChannel: RabbitChannelsEnum.Wallpapers,
    }),
    FoldersPluginModule.forFeature({
      combinedList: false,
      documentSchema: {
        schema: UserWallpapersSchema,
        schemaName: UserWallpapersSchemaName,
      },
      elastic: {
        env: environment.elastic,
        index: {
          documentIdField: '_id',
          elasticIndex: `user-wallpapers-folder`,
          type: `user-wallpapers-folder`,
        },
        mappingFields: {
          updatedAt: {
            type: 'date',
          },
          user: {
            fielddata: true,
            type: 'text',
          },
        },
        searchFields: [
          'currentWallpapers^1',
          'myWallpapers^1',
          'user^1',
          'updatedAt^1',
        ],
        storeFields: [
          'currentWallpapers',
          'myWallpapers',
          'user',
          'updatedAt^1',
        ],
      },
      filters: [
        {
          fieldName: '_id',
          filterConditions: FiltersService.getStringFilterConditions(),
          label: 'translation.values.filter_lablels._id',
          type: FilterOptionTypeEnum.string,
        },
        {
          fieldName: 'currentWallpapers.name',
          filterConditions: FiltersService.getStringFilterConditions(),
          label: 'translation.values.filter_lablels.name',
          type: FilterOptionTypeEnum.string,
        },
        {
          fieldName: 'currentWallpapers.theme',
          filterConditions: FiltersService.getStringFilterConditions(),
          label: 'translation.values.filter_lablels.theme',
          type: FilterOptionTypeEnum.string,
        },
        {
          fieldName: 'user',
          filterConditions: FiltersService.getStringFilterConditions(),
          label: 'translation.values.filter_lablels.user',
          type: FilterOptionTypeEnum.string,
        },
        {
          fieldName: 'updatedAt',
          filterConditions: FiltersService.getDateFilterConditions(),
          label: 'translation.values.filter_lablels.updatedAt',
          type: FilterOptionTypeEnum.date,
        },
      ],
      microservice: environment.microservice,
      rabbitConfig: {
        documentConsumer: {
          exchange: RabbitExchangesEnum.wallpapersFolders,
          rabbitChannel: RabbitChannelsEnum.WallpapersFolders,
        },
        exportConsumer: {
          exchange: RabbitExchangesEnum.wallpapersFolders,
          rabbitChannel: RabbitChannelsEnum.WallpapersFolders,
        },    
      },
      redisConfig: environment.redis,
      useBusiness: false,
    }),
    RulesSdkModule.forRoot({
      actions: [
        RuleActionEnum.copy,
        RuleActionEnum.move,
      ],
      fields: [
        {
          conditions: ConditionsService.getStringConditions(),
          fieldName: '_id',
          label: 'filters._id',
          type: RulesConditionDataTypeEnum.String,
        },
        {
          conditions: ConditionsService.getStringConditions(),
          fieldName: 'name',
          label: 'filters.currentWallpapers.name',
          type: RulesConditionDataTypeEnum.String,
        },
        {
          conditions: ConditionsService.getStringConditions(),
          fieldName: 'theme',
          label: 'filters.currentWallpapers.theme',
          type: RulesConditionDataTypeEnum.String,
        },
        {
          conditions: ConditionsService.getStringConditions(),
          fieldName: 'user',
          label: 'filters.user',
          type: RulesConditionDataTypeEnum.String,
        },
        {
          conditions: ConditionsService.getNumberConditions(),
          fieldName: 'updatedAt',
          label: 'filters.updatedAt',
          type: RulesConditionDataTypeEnum.Number,
        },
      ],
      jwtSecret: environment.jwtOptions.secret,
      microservice: environment.microservice,
      rabbitConfig: {
        channel: RabbitChannelsEnum.WallpapersFolders,
        exchange: RabbitExchangesEnum.wallpapersFolders,
      },
      redisConfig: environment.redis,
      rulesWsMicro: environment.webSocket.wsMicro,
      useBusiness: false,
    }),
    MongooseModule.forFeature([
      {
        name: CountryCityWallpapersSchemaName,
        schema: CountryCityWallpapersSchema,
      },
      {
        name: BusinessProductIndustrySchemaName,
        schema: BusinessProductIndustrySchema,
      },
      {
        name: BusinessProductSchemaName,
        schema: BusinessProductSchema,
      },
      {
        name: BusinessWallpapersSchemaName,
        schema: BusinessWallpapersSchema,
      },
      {
        name: UserProductIndustrySchemaName,
        schema: UserProductIndustrySchema,
      },
      {
        name: UserProductSchemaName,
        schema: UserProductSchema,
      },
      {
        name: UserWallpapersSchemaName,
        schema: UserWallpapersSchema,
      },
    ]),
    MediaSdkModule,
    EventDispatcherModule,
  ],
  providers: [
    BusinessProductsService,
    BusinessEventListener,
    BusinessWallpaperEventListner,
    BusinessWallpaperMessagesProducer,
    BusinessWallpapersService,
    CheckAssignedImagesCommand,
    CountryInfoService,
    CountryCityWallpapersService,
    CountryCityWallpapersUploader,
    DropboxClient,
    ExportBusinessWallpaperCommand,
    ImageProcessor,
    MediaServiceClient,
    ProductWallpaperFilterByIndustryService,
    ProductWallpaperFilterByNameService,
    ProductWallpaperFilterCollector,
    RequestAdditionalImagesCommand,
    SetupDefaultFoldersCommand,
    UploadWallpapersCommand,
    UserProductsService,
    UserWallpaperEventListner,
    UserWallpapersService,
  ],
})
export class WallpapersModule { }
