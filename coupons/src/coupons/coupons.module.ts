import { Model } from 'mongoose';
import { HttpModule, Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { ChannelSetSchema, ChannelSetSchemaName } from '@pe/channels-sdk';
import { EventDispatcherModule } from '@pe/nest-kit';
import { CheckoutBusMessageController } from './controllers/checkout-bus-message.controller';
import { CouponsController } from './controllers/coupons-http.controller';
import { CouponEventsProducer } from './producer/coupon-events.producer';
import {
  CountriesSchemaName,
  CountrySchema,
  CouponDocument,
  CouponLimitSchema,
  CouponLimitsSchemaName,
  CouponSchema,
  CouponSchemaName,
  CouponsTypeFixedAmountSchema,
  CouponTypeBuyXGetYSchema,
  CouponTypeEmbeddedDocument,
  CouponTypeFreeShippingSchema,
  CouponTypePercentageSchema,
  CouponTypeSchema,
  CouponTypeSchemaName,
  CouponUsedSchema,
  CouponUsedSchemaName,
} from './schemas';
import {
  BuyXGetYCouponService,
  CouponsService,
  CouponUsedService,
  FixedCouponService,
  FreeShippingCouponService,
  PercentageCouponService,
} from './services';
import { CouponTypeEnum, RabbitChannelsEnum, RabbitExchangesEnum } from './enum';
import { BusinessModule } from '@pe/business-kit';
import { CouponExportCommand } from './commands';
import { CouponEventsListener } from './listeners';
import { AnalyzerEnum, FoldersPluginModule, SearchAnalyzer } from '@pe/folders-plugin';
import { environment } from '../environments';
import { RuleActionEnum, RulesSdkModule } from '@pe/rules-sdk';
import { AdminCouponsController } from './controllers/admin-coupons.controller';

@Module({
  controllers: [
    CouponsController,
    CheckoutBusMessageController,
    AdminCouponsController,
  ],
  exports: [],
  imports: [
    HttpModule,
    EventDispatcherModule,
    BusinessModule.forRoot({
      customSchema: null,
      rabbitChannel: RabbitChannelsEnum.Coupons,
    }),
    FoldersPluginModule.forFeature<CouponDocument>({
      combinedList: true,
      documentSchema: {
        schema: CouponSchema as any,
        schemaName: CouponSchemaName,
      },
      elastic: {
        env: environment.elasticEnv,
        index: {
          businessIdField: 'businessId',
          documentIdField: '_id',
          elasticIndex: `coupons-folder`,
          type: `coupons-folder`,
        },
        mappingFields: {
          channelSet: {
            fielddata: true,
            type: 'text',
          },
          code: {
            analyzer: AnalyzerEnum.Autocomplete,
            fielddata: true,
            search_analyzer: SearchAnalyzer.AutocompleteSearch,
            type: 'text',
          },
          customerEligibility: {
            fielddata: true,
            type: 'text',
          },
          customerEligibilityCustomerGroups: {
            fielddata: true,
            type: 'text',
          },
          customerEligibilitySpecificCustomers: {
            fielddata: true,
            type: 'text',
          },
          description: {
            analyzer: AnalyzerEnum.Autocomplete,
            fielddata: true,
            search_analyzer: SearchAnalyzer.AutocompleteSearch,
            type: 'text',
          },
          endDate: {
            type: 'date',
          },
          isAutomaticDiscount: {
            type: 'boolean',
          },
          name: {
            analyzer: AnalyzerEnum.Autocomplete,
            fielddata: true,
            search_analyzer: SearchAnalyzer.AutocompleteSearch,
            type: 'text',
          },
          startDate: {
            type: 'date',
          },
          status: {
            fielddata: true,
            type: 'text',
          },
          updatedAt: {
            type: 'date',
          },
        },
        searchFields: [
          'code^1',
          'customerEligibility^1',
          'description^1',
          'endDate^1',
          'isAutomaticDiscount^1',
          'name^1',
          'startDate^1',
          'status^1',
          'updatedAt^1',
        ],
        storeFields: [
          'channelSets',
          'code',
          'customerEligibility',
          'customerEligibilityCustomerGroups',
          'customerEligibilitySpecificCustomers',
          'description',
          'endDate',
          'isAutomaticDiscount',
          'limits',
          'name',
          'startDate',
          'status',
          'type',
          'updatedAt',
        ],
      },
      filters: [],
      microservice: 'coupons',

      rabbitConfig: {
        documentConsumer: {
          exchange: RabbitExchangesEnum.couponsFolders,
          rabbitChannel: RabbitChannelsEnum.CouponsFolders,
        },
        exportConsumer: {
          exchange: RabbitExchangesEnum.couponsFolders,
          rabbitChannel: RabbitChannelsEnum.CouponsFolders,
        },
      },

      redisConfig: environment.redis,

      useBusiness: true,
    }),
    RulesSdkModule.forRoot({
      redisConfig: environment.redis,
      actions: [RuleActionEnum.copy, RuleActionEnum.move],
      fields: [],
      rabbitConfig: {
        channel: RabbitChannelsEnum.CouponsFolders,
        exchange: RabbitExchangesEnum.couponsFolders,
      },
      useBusiness: true,
      microservice: 'coupons',
    }),
    BusinessModule,
    MongooseModule.forFeature([
      {
        name: ChannelSetSchemaName,
        schema: ChannelSetSchema,
      },
      {
        name: CouponLimitsSchemaName,
        schema: CouponLimitSchema,
      },
      {
        name: CouponTypeSchemaName,
        schema: CouponTypeSchema,
      },
      {
        name: CouponSchemaName,
        schema: CouponSchema,
      },
      {
        name: CountriesSchemaName,
        schema: CountrySchema,
      },
      {
        name: CouponUsedSchemaName,
        schema: CouponUsedSchema,
      },
    ]),
  ],
  providers: [
    CouponEventsProducer,
    CouponsService,
    BuyXGetYCouponService,
    FreeShippingCouponService,
    FixedCouponService,
    PercentageCouponService,
    CouponUsedService,
    CouponExportCommand,
    CouponEventsListener,
    //  @TODO: move out it
    {
      inject: [getModelToken(CouponTypeSchemaName)],
      provide: getModelToken(CouponTypeEnum.FIXED_AMOUNT),
      useFactory: (
        CouponsTypesModel: Model<CouponTypeEmbeddedDocument>,
      ) => CouponsTypesModel.discriminator(
        CouponTypeEnum.FIXED_AMOUNT,
        CouponsTypeFixedAmountSchema,
      ),
    },
    {
      inject: [getModelToken(CouponTypeSchemaName)],
      provide: getModelToken(CouponTypeEnum.PERCENTAGE),
      useFactory: (
        CouponsTypesModel: Model<CouponTypeEmbeddedDocument>,
      ) => CouponsTypesModel.discriminator(
        CouponTypeEnum.PERCENTAGE,
        CouponTypePercentageSchema,
      ),
    },
    {
      inject: [getModelToken(CouponTypeSchemaName)],
      provide: getModelToken(CouponTypeEnum.FREE_SHIPPING),
      useFactory: (
        CouponsTypesModel: Model<CouponTypeEmbeddedDocument>,
      ) => CouponsTypesModel.discriminator(
        CouponTypeEnum.FREE_SHIPPING,
        CouponTypeFreeShippingSchema,
      ),
    },
    {
      inject: [getModelToken(CouponTypeSchemaName)],
      provide: getModelToken(CouponTypeEnum.BUY_X_GET_Y),
      useFactory: (
        CouponsTypesModel: Model<CouponTypeEmbeddedDocument>,
      ) => CouponsTypesModel.discriminator(
        CouponTypeEnum.BUY_X_GET_Y,
        CouponTypeBuyXGetYSchema,
      ),
    },
  ],
})
export class CouponsModule { }
