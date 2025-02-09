import { HttpModule, HttpStatus, Module, OnModuleInit, DynamicModule, Type, forwardRef } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { getModelToken, InjectModel, MongooseModule } from '@nestjs/mongoose';
import { GraphQLError, GraphQLScalarType } from 'graphql';
import { Model } from 'mongoose';

import { CommonModelsNamesEnum, CommonSdkModule } from '@pe/common-sdk';
import { ProductRulesModule, RuleSchema, RuleSchemaName } from '@pe/products-sdk';
import { NotificationsSdkModule } from '@pe/notifications-sdk';
import { ProductsResolver } from './graphql/resolvers/products.resolver';
import {
  CheckAssignedImagesCommand,
  FillStandardVatRatesForCountryCommand,
  MigrateSaleCommand,
  PopulateSlugCommand,
  ProductsEsExportCommand,
  ProductsEsSetupCommand,
  ProductsExportCommand,
  RequestAdditionalImagesCommand,
  SanitizeCommand,
} from './commands';
import {
  AdminProductsSettingsController,
  BillingSubscriptionMessageBusController,
  ExportMessageBusController,
  MarketplaceMessageBusController,
  ProductsCheckoutController,
  ProductsCollectionController,
  ProductsController,
  ProductsSettingsController,
  RabbitController,
  SlugPopulatedBusController,
  SynchronizerBulkMessageBusController,
  SynchronizerBulkStaticMessageBusController,
  SynchronizerController,
  SynchronizerMessageBusController,
} from './controllers';
import { ListenersEnum } from './event-listeners';
import { ProductModel } from './models';
import { ProductsEventsProducer } from './producers';
import {
  CommandService,
  FilterService,
  ProductAlbumService,
  ProductCategoriesService,
  ProductCopyImageService,
  ProductCountrySettingService,
  ProductNotificationsService,
  ProductRecommendationsService,
  ProductsElasticService,
  ProductService,
  ProductSettingsService,
  ProductSynchronizationService,
  ProductTranslationService,
} from './services';
import { ChannelSetModule } from '../channel-set/channel-set.module';
import {
  ProductCategorySchema,
  ProductCountrySettingSchema,
  ProductRecommendationsSchema,
  ProductSchema,
  ProductSettingsSchema,
  ProductTranslationSchema,
  ProductVariantSchema,
} from './schemas';
import { environment } from '../environments';
import { ProductCategoriesResolver } from './graphql/resolvers/product-categories.resolver';
import { ParseSortDirPipe } from './graphql/pipes/parse-sort-dir.pipe';
import { MarketPlaceModule } from '../marketplace';
import { OptionResolver } from './graphql/resolvers/options.resolver';
import { optionSchema } from './schemas/option.schema';
import { OptionsService } from './services/options.service';
import { productBaseSchema } from './schemas/product-base.schema';
import { ProductVariantsService } from './services/product-variants.service';
import { ProductVariantsResolver } from './graphql/resolvers/product-variants.resolver';
import { ProductRecommendationsResolver } from './graphql/resolvers/product-recommendations.resolver';
import { ProductBaseService } from './services/product-base.service';
import { ProductVariantModel } from './models/product-variant.model';
import { CategoriesModule } from '../categories/categories.module';
import { MarketplaceResolver } from './graphql/resolvers/marketplaces.resolver';
import { NewProductsModule } from '../new-products/new-products.module';
import { ProductBusAdapter } from '../bus/product-bus.adapter';
import { BusinessModule } from '../business/business.module';
import { SampleProductsModule } from '../sample-products';
import { CollectionAssociateVoter, ProductCreateVoter, ProductDeleteVoter, ProductUpdateVoter } from './voters';
import { FiltrationOptionsController } from './controllers/filtration-options.controller';
import { VariantsModule } from '../variants/variants.module';
import { ConvertCategoriesCommand } from './commands/convert-categories.command';
import { ConditionsChecker } from './services/conditions-checker';
import { CheckersEnum } from './services/conditions-checker/checkers';
import { UploadImagesCommand } from '../sample-products/commands';
import { ProductRulesMessageBusController } from './controllers/product-rules-message-bus.controller';
import { CategoriesResolver } from './graphql/resolvers/categories.resolver';
import { CategorySchema, CategorySchemaName } from '../categories/schemas';
import { ProductAlbumResolver } from './graphql/resolvers/product-album.resolver';
import { AlbumModule } from '../album';
import { CounterModule } from '../counter';
import { BusinessResolver } from './graphql/resolvers/business.resolver';
import { MessageBusChannelsEnum } from '../shared';
import { ProductTranslationsResolver } from './graphql/resolvers/product-translation.resolver';
import { ProductCountrySettingsResolver } from './graphql/resolvers/product-country-setting.resolver';
import { FolderModule } from '../folder';
import { AdminCollectionsController } from '../categories/controllers';
import { AdminProductsController } from './controllers/admin-products.controller';
import { CategoriesPredictorModule } from '../categories-predictor/categories-predictor.module';


interface HttpExceptionMessage {
  message: string;
  error: string;
  statusCode: number;
}

@Module({
  controllers: [
    SynchronizerBulkStaticMessageBusController,
    SynchronizerController,
    ProductsSettingsController,
    SynchronizerMessageBusController,
    BillingSubscriptionMessageBusController,
    FiltrationOptionsController,
    RabbitController,
    MarketplaceMessageBusController,
    ProductsCollectionController,
    ProductRulesMessageBusController,
    ProductsCheckoutController,
    ProductsController,
    ExportMessageBusController,
    SlugPopulatedBusController,
    // Admin Controllers
    AdminProductsController,
    AdminCollectionsController,
    AdminProductsSettingsController,
  ],
  exports: [ProductSettingsService, ProductNotificationsService, ProductService],
  imports: [
    HttpModule,
    MarketPlaceModule,
    AlbumModule,
    ChannelSetModule,
    GraphQLModule.forRoot({
      context: ({ req }: { req: any }): { req: any } => ({ req }),
      cors: false,
      debug: !environment.production,
      include: [ProductsModule, NewProductsModule, VariantsModule],
      path: '/products',
      typePaths: ['./src/products/**/*.graphql', './src/new-products/**/*.graphql', './src/variants/**/*.graphql'],

      formatError: (exception: any): any => {
        const isHttpExceptionMessage: (object: any) => object is HttpExceptionMessage = (
          object: any,
        ): object is HttpExceptionMessage => {
          return (
            typeof object.message === 'string' &&
            typeof object.error === 'string' &&
            typeof object.statusCode === 'number'
          );
        };

        const isGraphQLExceptionMessage: (object: any) => object is GraphQLError = (
          object: any,
        ): object is GraphQLError => {
          return (
            typeof object.message === 'string' &&
            object.extensions !== null &&
            typeof object.extensions.code === 'string'
          );
        };

        const response: any = { };
        if (!environment.production) {
          Object.assign(response, exception);

          if (
            response &&
            response.extensions &&
            response.extensions.exception &&
            response.extensions.exception.response
          ) {
            response.extensions.exception.message = response.extensions.exception.response;
          }
        }

        response.message = 'Internal server error';
        if (
          exception.extensions &&
          exception.extensions.exception &&
          exception.extensions.exception.response &&
          isHttpExceptionMessage(exception.extensions.exception.response)
        ) {
          response.error = exception.extensions.exception.response.error;
          response.statusCode = exception.extensions.exception.response.statusCode;

          if (exception.extensions.exception.response.statusCode !== HttpStatus.INTERNAL_SERVER_ERROR) {
            response.message = exception.extensions.exception.response.message;
          }
        } else if (isGraphQLExceptionMessage(exception)) {
          response.error = exception.extensions.code;
          response.statusCode = HttpStatus.BAD_REQUEST;

          if (exception.extensions.code !== 'INTERNAL_SERVER_ERROR') {
            response.message = exception.message;
          }
          if (exception.extensions && exception.extensions.status === 403) {
            response.message = exception.message;
          }
        }

        return response;
      },
      resolvers: {
        VariableConditionValueType: new GraphQLScalarType({
          name: 'VariableConditionValueType',
          parseValue: (value: any) => value,
          serialize: (value: any) => value,
        }),
      },
    }),
    NotificationsSdkModule,
    MongooseModule.forFeature([
      { name: 'ProductBase', schema: productBaseSchema, collection: 'products' },
      { name: 'ProductRecommendations', schema: ProductRecommendationsSchema },
      { name: 'ProductTranslation', schema: ProductTranslationSchema },
      { name: 'ProductCountrySetting', schema: ProductCountrySettingSchema },
      { name: 'ProductSettings', schema: ProductSettingsSchema },
      { name: 'ProductCategory', schema: ProductCategorySchema },
      { name: 'Option', schema: optionSchema },
      {
        name: RuleSchemaName,
        schema: RuleSchema,
      },
      { name: CategorySchemaName, schema: CategorySchema },
    ]),
    CommonSdkModule.forRoot({
      channel: MessageBusChannelsEnum.products,
      consumerModels: [CommonModelsNamesEnum.TaxModel],
      rsaPath: environment.rsa,
    }),
    CategoriesModule,
    CounterModule,
    NewProductsModule,
    BusinessModule,
    SampleProductsModule,
    forwardRef(() => CategoriesPredictorModule),
    ProductRulesModule.forRoot({
      env: process.env,
      ruleDiscoveryConfigs: [
      ],
    }),
    FolderModule,
  ],
  providers: [
    // Commands
    CheckAssignedImagesCommand,
    ConvertCategoriesCommand,
    FillStandardVatRatesForCountryCommand,
    ProductsEsSetupCommand,
    ProductsEsExportCommand,
    ProductsExportCommand,
    RequestAdditionalImagesCommand,
    SanitizeCommand,
    UploadImagesCommand,
    //
    {
      inject: [getModelToken('ProductBase')],
      provide: getModelToken('Product'),
      useFactory: (plm: Model<ProductModel>): Model<ProductModel> => plm.discriminator('Product', ProductSchema),
    },
    {
      inject: [getModelToken('ProductBase')],
      provide: getModelToken('ProductVariant'),
      useFactory: (plm: Model<ProductModel>): Model<ProductModel> => plm.discriminator('Variant', ProductVariantSchema),
    },
    ProductsEventsProducer,
    OptionsService,
    ProductService,
    ProductSettingsService,
    ProductNotificationsService,
    ProductVariantsService,
    OptionResolver,
    ProductsResolver,
    ProductCategoriesResolver,
    ProductVariantsResolver,
    ProductRecommendationsResolver,
    ProductSynchronizationService,
    ProductCategoriesService,
    ProductCopyImageService,
    ParseSortDirPipe,
    ProductBaseService,
    ProductRecommendationsService,
    ProductTranslationsResolver,
    ProductCountrySettingsResolver,
    MarketplaceResolver,
    ProductBusAdapter,
    ProductCreateVoter,
    ProductUpdateVoter,
    ProductDeleteVoter,
    ProductsElasticService,
    ConvertCategoriesCommand,
    PopulateSlugCommand,
    CollectionAssociateVoter,
    ...ListenersEnum,
    ConditionsChecker,
    ...CheckersEnum,
    CategoriesResolver,
    BusinessResolver,
    FilterService,
    ProductAlbumResolver,
    ProductAlbumService,
    ProductTranslationService,
    ProductCountrySettingService,
    MigrateSaleCommand,
    CommandService,
  ],
})
export class ProductsModule implements OnModuleInit {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<ProductModel>,
    @InjectModel('ProductVariant') private readonly variantModel: Model<ProductVariantModel>,
    private readonly productService: ProductService,
  ) { }

  public async onModuleInit(): Promise<void> {
    this.productModel.schema.path('images').set(mapImages);
    this.variantModel.schema.path('images').set(mapImages);
    this.productModel.schema.path('videos').set(mapVideos);

    const productService: ProductService = this.productService;
    function mapImages(this: { imagesUrl: string[] }, x: string[]): string[] {
      this.imagesUrl = productService.mapImages(x);

      return x;
    }
    function mapVideos(this: { videosUrl: string[] }, x: string[]): string[] {
      this.videosUrl = productService.mapVideos(x);

      return x;
    }
  }

  public static forRoot(): DynamicModule {
    const controllers: Array<Type<any>> = [];

    if (environment.rabbitProductQueueName) {
      controllers.push(SynchronizerBulkMessageBusController);
    }

    return {
      controllers: [
        ...controllers,
      ],
      module: ProductsModule,
    };

  }
}
