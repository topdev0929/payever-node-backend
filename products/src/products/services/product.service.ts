import * as sanitizeHtml from 'sanitize-html';
import { HttpService, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TaxService } from '@pe/common-sdk';
import { Observable } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { ClientSession, FilterQuery, LeanDocument, Model } from 'mongoose';
import { UserInputError } from 'apollo-server-errors';
import { catchError, map } from 'rxjs/operators';
import { EventDispatcher, FilterFieldTypeEnum, ObjectFieldConditionEnum, StringFieldConditionEnum } from '@pe/nest-kit';
import { ProductBusAdapter } from '../../bus/product-bus.adapter';
import { BusinessModel } from '../../business/models';
import { BusinessService } from '../../business/services';
import { CategoryModel, CollectionModel } from '../../categories/models';
import { CategoryService, CollectionsService, OldCategoriesMapperService } from '../../categories/services';
import { environment } from '../../environments';
import { MarketplaceTypeEnum } from '../../marketplace';
import { MarketplaceAssigmentInterface } from '../../marketplace/interfaces';
import { MarketplaceAssigmentModel, MarketplaceModel } from '../../marketplace/models';
import { MarketplaceAssigmentService, MarketplaceService } from '../../marketplace/services';
import { FilterByBusinessInterface, OptionOfFilter, ProductChannelSetCategoriesInterface, ProductInterface } from '../../products/interfaces';
import { ProductService as NewProductService } from '../../new-products/product.service';
import { SampleProductConverter } from '../../sample-products/converter/sample-products-converter';
import { SampleProductInterface } from '../../sample-products/interfaces';
import { SampleProductsService } from '../../sample-products/services';
import {
  PaginationDto,
  ProductCategoryDto,
  ProductDto,
  ProductMarketplaceDto,
  ProductQueryDto,
  ProductVariantsDto,
  SortDto,
} from '../dto';
import { FilterDto } from '../dto/filter.dto';
import { FilterTypeByBusinessEnum, ProductFilterFieldEnum, ProductFilterFieldsMapping, ProductsEventsEnum, ProductSpecialContext } from '../enums';
import { QueryBuilder, SaleHelper } from '../../common/helpers';
import {
  ProductCategoryInterface,
  ProductChannelSetInterface,
  ProductMarketplaceInterface,
  ProductsPaginatedInterface,
  TranslationInterface,
} from '../interfaces';
import {
  PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  PopulatedVariantsLeanProduct,
  PopulatedVariantsProductModel,
  ProductModel,
  ProductRecommendationsModel,
} from '../models';
import { LeanProductVariant, ProductVariantModel } from '../models/product-variant.model';
import { ProductBaseService } from './product-base.service';
import { ProductNotificationsService } from './product-notifications.service';
import { ProductSettingsService } from './product-settings.service';
import { SampleProductsEventsEnum } from '../../sample-products/enums';
import { BusinessDto } from '../../business/dto';
import { ChannelSetService } from '../../channel-set/services';
import { ChannelSetModel } from '../../channel-set/models';
import { CategoryFilterFieldsMapping } from '../../categories/enums';
import { CounterService } from '../../counter/services';
import { CreateCollectionDto } from '../../categories/dto';
import { ProductsEventsProducer } from '../producers';
import { ProductTranslationService } from './product-translation.service';
import { ProductVariantsService } from './product-variants.service';
import { ProductCountrySettingService } from './product-country-setting.service';
import { FoldersEventsEnum } from '@pe/folders-plugin';
import { ProductDocumentLikeDto } from '../../bus/product-export-bus.dto';
import { FIX_MISTYPING, FORCE_POPULATION_TYPE } from 'src/special-types';
import slugify from 'slugify';
import { ChannelTypeEnum } from '../../channel-set/enums';
import { ProductChannelSetDto } from '../dto/product-channel-set.dto';
import { ProductPriceDto } from '../dto/product-price.dto';
import { RangeFieldConditionEnum } from '../../common/enums';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<ProductModel>,
    @InjectModel('ProductVariant') private readonly variantModel: Model<ProductVariantModel>,
    @InjectModel('ProductRecommendations') private readonly recommendationsModel: Model<ProductRecommendationsModel>,
    private productSettingsService: ProductSettingsService,
    private productNotificationsService: ProductNotificationsService,
    private marketplaceService: MarketplaceService,
    private marketplaceAssigmentService: MarketplaceAssigmentService,
    private readonly taxService: TaxService,
    private readonly productBaseService: ProductBaseService,
    @Inject('NewProductService')
    private readonly newProductService: NewProductService,
    private readonly productBusAdapter: ProductBusAdapter,
    private readonly businessService: BusinessService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly logger: Logger,
    private readonly oldCategoriesMapper: OldCategoriesMapperService,
    private readonly sampleProductService: SampleProductsService,
    private readonly channelSetService: ChannelSetService,
    private readonly categoryService: CategoryService,
    private readonly httpService: HttpService,
    private readonly collectionsService: CollectionsService,
    private readonly counterService: CounterService,
    private readonly productsEventsProducer: ProductsEventsProducer,
    private readonly productTranslationService: ProductTranslationService,
    private readonly productCountrySettingService: ProductCountrySettingService,
    private readonly productVariantsService: ProductVariantsService,
  ) { }


  public async getFilterByBusiness(businessId: string): Promise<FilterByBusinessInterface> {

    const products = await this.productModel
    .aggregate([
      {$match: {businessId}},
      {
        $lookup: {
          as: 'populatedCollections',
          foreignField: '_id',
          from: 'collections',
          localField: 'collections',
        },
      },
      { $lookup: { from: 'products', localField: '_id', foreignField: 'product', as: 'variants' } },
      { $lookup:
        {
          as: 'channelSets',
          foreignField: '_id',
          from: 'channelsets',
          localField: 'channelSets',
        },
      },
    ])
    .exec();
    

    const defaultValue: OptionOfFilter =  {
      title: 'unknown',
      value: {
        field: '',
        fieldCondition: StringFieldConditionEnum.Is,
        fieldType: FilterFieldTypeEnum.String,
        value: '',
      },
    };

    const attributesOptions = products.reduce((accumulator: any, currentValue: any) => {
      return accumulator.concat(currentValue.attributes);
    }, []).map(v => ({title: v.name, value: {
      field: ProductFilterFieldEnum.AttributeValue,
      value: v.value,
      fieldCondition: ObjectFieldConditionEnum.Is,
      fieldType: FilterFieldTypeEnum.Object,
    }}));

    const priceDefValue: number[] = products.map(p => p.price).sort((a, b) => a - b);


    const categoriesOptions: OptionOfFilter[] = products.reduce((accumulator: any, currentValue: any) => {
      return accumulator.concat(
        (currentValue.channelSetCategories || []).reduce((accumulator2: any, currentValue2: any) => {
          return accumulator2.concat(currentValue2.categories);
        }, []));
    }, []).map(v => ({title: v.title, value: {
      field: ProductFilterFieldEnum.ChannelSetCategoriesTitle,
      value: v.title,
      fieldCondition: ObjectFieldConditionEnum.Is,
      fieldType: FilterFieldTypeEnum.Object,
    }}));


    const maxPriceStrArr: string[] = Math.round(Math.max(...priceDefValue) / 7).toString().split('');
    const offsetPrice: number = parseInt((parseInt(maxPriceStrArr.shift(), 10) + 1).toString() + maxPriceStrArr.map(() => 0 ).join(''), 10);
    const priceArray: Array<{from: number; to: number}> = [];
    for (let i = 0; i < 7 ; i++) {
      priceArray.push({from: i * offsetPrice, to: (i + 1) * offsetPrice});
    }

    const priceOptions: OptionOfFilter[] = priceArray.map((v : {from: number; to: number}) => ({title: `${v.from} To ${v.to}`, value: {
      field: ProductFilterFieldEnum.Price,
      value: `${v.from}|${v.to}`,
      fieldCondition: RangeFieldConditionEnum.Range,
      fieldType: FilterFieldTypeEnum.Nested,
    }}));


    const typeOptions: OptionOfFilter[] = products.filter(v => v.type).map(v => ({title: v.type, value: {
      field: ProductFilterFieldEnum.Type,
      value: v.type,
      fieldCondition: ObjectFieldConditionEnum.Is,
      fieldType: FilterFieldTypeEnum.Object,
    }}));

    const variantsOptions: OptionOfFilter[] = products.reduce((accumulator: any, currentValue: any) => {
      return accumulator.concat(currentValue.variants);
    }, []).reduce((accumulator: any, currentValue: any) => {
      return accumulator.concat(currentValue.options);
    }, []).map(v => ({title: `${v.name} ${v.value}`, value: {
      field: ProductFilterFieldEnum.VariantOptionsValue,
      value: v.value,
      fieldCondition: ObjectFieldConditionEnum.Is,
      fieldType: FilterFieldTypeEnum.Object,
    }}));

    const brandOptions: OptionOfFilter[] = products.filter(v => v.brand).map(v => ({title: v.brand, value: {
      field: ProductFilterFieldEnum.Brand,
      value: v.brand,
      fieldCondition: ObjectFieldConditionEnum.Is,
      fieldType: FilterFieldTypeEnum.Object,
    }}));

    const conditionOptions: OptionOfFilter[] = products.filter(v => v.condition).map(v => ({title: v.condition, value: {
      field: ProductFilterFieldEnum.Condition,
      value: v.condition,
      fieldCondition: ObjectFieldConditionEnum.Is,
      fieldType: FilterFieldTypeEnum.Object,
    }}));


    const filters: FilterByBusinessInterface = {
      attributes: {
        defaultValue,
        type: FilterTypeByBusinessEnum.Select,
        options: this.removeDuplicateOption(attributesOptions),
      },
      categories: {
        defaultValue,
        type: FilterTypeByBusinessEnum.Select,
        options: this.removeDuplicateOption(categoriesOptions),
      },
      price: {
        defaultValue: defaultValue,
        type: FilterTypeByBusinessEnum.Select,
        options: this.removeDuplicateOption(priceOptions),
      },
      type: {
        defaultValue: defaultValue,
        type: FilterTypeByBusinessEnum.Select,
        options: this.removeDuplicateOption(typeOptions),
      },
      variants: {
        defaultValue: defaultValue,
        type: FilterTypeByBusinessEnum.Select,
        options: this.removeDuplicateOption(variantsOptions),
      },
      brands: {
        defaultValue: defaultValue,
        type: FilterTypeByBusinessEnum.Select,
        options: this.removeDuplicateOption(brandOptions),
      },
      condition: {
        defaultValue: defaultValue,
        type: FilterTypeByBusinessEnum.Select,
        options: this.removeDuplicateOption(conditionOptions),
      }, 
    };

    return  filters;
  }


  private removeDuplicateOption(options: OptionOfFilter[]): OptionOfFilter[] {
    return [...new Map(
      options.map(c => [c.title, c])
    ).values()];
  }

  public async createFromDto(
    dto: ProductDto,
    validate: boolean = true,
  ): Promise<PopulatedVariantsCategoryCollectionsChannelSetProductModel> {
    if (dto.title) {
      dto.title = sanitizeHtml(dto.title);
    }
    if (!dto.businessId) {
      dto.businessId = dto.businessUuid;
    }
    const businessId: string = dto.businessId;

    if (validate) {
      await this.validate(dto);
    }
    const currency: string = await this.productSettingsService.getCurrency(businessId);

    const business: BusinessModel = await this.businessService.getById(businessId);

    if (!dto.category && dto.categories && dto.categories.length > 0) {
      const newCategories: CategoryModel[] = await this.oldCategoriesMapper.findOrCreateCategory(
        dto.categories,
        dto.businessId,
      );

      const subcategory: CategoryModel = await this.oldCategoriesMapper.findOrCreateSubcategory(
        newCategories[0],
        dto.categories,
      );

      const productCategory: CategoryModel = subcategory || newCategories[0];
      dto.category = productCategory ? productCategory.id : null;

      dto.categories = newCategories.map(
        (newCategory: CategoryModel) => {
          return {
            businessId: newCategory.businessId,
            id: newCategory.id,
            slug: newCategory.slug,
            title: newCategory.title,
          };
        },
      );
    }

    if (dto.importedId) {
      const productToBeImportFrom: ProductModel = await this.productModel.findById(dto.importedId);

      if (!(productToBeImportFrom && productToBeImportFrom.dropshipping)) {
        dto.importedId = undefined;
      }
    }

    let dropshipping: boolean = false;
    if (
      dto.channelSets &&
      dto.channelSets.length &&
      dto.channelSets.findIndex((item: ProductChannelSetDto) => item.type === ChannelTypeEnum.Dropshipping) !== -1
    ) {
      dropshipping = true;
    }

    const productPrototype: ProductInterface = {
      active: dto.active,
      attributes: dto.attributes || [],
      barcode: dto.barcode,
      brand: dto.brand,
      condition: dto.condition,
      businessId: dto.businessId,
      channelSetCategories: dto.channelSetCategories as FIX_MISTYPING,
      categories: dto.categories as FIX_MISTYPING,
      category: dto.category,
      collections: dto.collections || [],
      company: dto.company,
      country: dto.country ? dto.country : business?.companyAddress.country,
      currency: currency,
      deliveries: dto.deliveries,
      description: dto.description,
      dropshipping,
      ean: dto.ean,
      example: dto.example,
      images: dto.images,
      imagesUrl: dto.imagesUrl,
      importedId: dto.importedId,
      language: dto.language || business?.defaultLanguage?.toLocaleUpperCase() || 'EN',
      options: dto.options || [],
      price: dto.price,
      priceTable: this.priceTableSaleMap(dto.priceTable),
      sale: this.convertSaleDtoToDate(dto.sale, dto.price),
      seo: dto.seo,
      shipping: dto.shipping,
      sku: dto.sku,
      title: dto.title,
      type: dto.type,
      variantAttributes: dto.variantAttributes || [],
      vatRate: dto.vatRate || null,
      videos: dto.videos,
      videosUrl: dto.videosUrl,
      origin: dto.origin || 'commerceos',
    };
    const session: ClientSession = await this.productModel.db.startSession();
    let newProduct: ProductModel;

    const hasProducts: boolean =
      (await this.productModel.findOne({
        businessId: dto.businessId,
      })) !== null;

    await session.withTransaction(async () => {
      newProduct = (await this.productModel.create([productPrototype], { session }))[0];
      await this.createProductVariants(newProduct, dto.variants, session);
      await newProduct.save();
    });

    if (dto.channelSets && dto.channelSets.length) {
      await this.updateProductsToChannelSet(dto.businessId, dto.channelSets, [newProduct.id], []);
    }

    let newPopulatedProduct: PopulatedVariantsCategoryCollectionsChannelSetProductModel =
    (await this.productModel.findById(newProduct.id)
      .populate('variants')
      .populate('category')
      .populate('collections')
      .populate('channelSets')
      .exec()
    ) as FORCE_POPULATION_TYPE;

    newPopulatedProduct = await this.populateSlug(newPopulatedProduct);    
    newPopulatedProduct.inventory = dto.inventory;

    let recommendations: ProductRecommendationsModel;

    if (dto.recommendations) {
      recommendations = await this.recommendationsModel.findOneAndUpdate(
        {
          productId: newPopulatedProduct.id,
        },
        {
          businessId: dto.businessId,
          recommendations: dto.recommendations.recommendations,
          sku: dto.sku,
          tag: dto.recommendations.tag,
        } as any,
        {
          new: true,
          session,
          setDefaultsOnInsert: true,
          upsert: true,
        },
      );
    }
    if (!newPopulatedProduct.images || !newPopulatedProduct.images.length) {
      await this.productNotificationsService.sendMissingImageNotification(newPopulatedProduct);
    }

    if (dto.marketplaces && dto.marketplaces.length) {
      const assigments: MarketplaceAssigmentInterface[] = await this.filterAndPrepareMarketplaces(newPopulatedProduct);
      await this.marketplaceAssigmentService.createMany(assigments);
    }

    const productCreatedEvents: Array<Promise<any[]>> = [];
    productCreatedEvents.push(this.eventDispatcher.dispatch(ProductsEventsEnum.ProductCreated, newPopulatedProduct));

    this.productBusAdapter.processProductVariants(
      newPopulatedProduct,
      newPopulatedProduct.variants,
      (vp: ProductDocumentLikeDto) => {
        productCreatedEvents.push(this.eventDispatcher.dispatch(ProductsEventsEnum.ProductCreated, vp, true));
      },
    );

    if (!hasProducts) {
      await this.eventDispatcher.dispatch(ProductsEventsEnum.FirstProductCreated, newPopulatedProduct);
      newPopulatedProduct = (await this.productModel.findById(newPopulatedProduct.id)
        .populate('variants')
        .populate('category')
        .populate('collections')
        .populate('channelSets')
        .exec()
      ) as FORCE_POPULATION_TYPE;
    }

    await Promise.all(productCreatedEvents);

    await this.productTranslationService.upsertTranslation(newPopulatedProduct);
    await this.productCountrySettingService.upsertCountrySetting(newPopulatedProduct, recommendations);

    let result: any = { ...newPopulatedProduct.toObject() };

    result = SaleHelper.saleDateFormat(result);

    return result;
  }

  public async updateFromDto(
    productDto: ProductDto,
  ): Promise<PopulatedVariantsCategoryCollectionsChannelSetProductModel> {
    if (productDto.title) {
      productDto.title = sanitizeHtml(productDto.title);
    }
    if (!productDto.businessId) {
      productDto.businessId = productDto.businessUuid;
    }
    productDto = this.salePriceFromPercent(productDto);

    const oldProductDoc: PopulatedVariantsProductModel = (await this.productModel
      .findById(productDto.id)
      .populate('variants')
      .exec()) as FORCE_POPULATION_TYPE;
    await this.validate(productDto, oldProductDoc);

    if (!oldProductDoc) {
      throw Error(`Product "${productDto.id}" is not found.`);
    }

    if (oldProductDoc.isLocked) {
      throw Error(`Product is locked`);
    }


    const updated = await this.productDtoUpdate(productDto, oldProductDoc);
    productDto = updated.productDto;
    const { oldProduct, variantsDiff }: {
      oldProduct: PopulatedVariantsLeanProduct;
      variantsDiff: {
        create: ProductVariantsDto[];
        delete: LeanProductVariant[];
        update: ProductVariantsDto[];
      };
    } = updated;
    const itemsToCreate: ProductVariantsDto[] = [...variantsDiff.create];

    let updatedProduct: PopulatedVariantsProductModel;
    let createdVariants: ProductVariantModel[];
    let recommendations: ProductRecommendationsModel;

    const session: ClientSession = await this.productModel.db.startSession();
    await session.withTransaction(async () => {
      const upd = await this.updateProductDtoTransaction(
        productDto,
        oldProductDoc,
        oldProduct,
        variantsDiff,
        itemsToCreate,
        session
      );
      updatedProduct = upd.updatedProduct;
      createdVariants = upd.createdVariants;
      recommendations = upd.recommendations;
    });

    let updatedPopulatedProduct: PopulatedVariantsCategoryCollectionsChannelSetProductModel = (await updatedProduct
      .populate('variants')
      .populate('category')
      .populate('collections')
      .populate('channelSets')
      .execPopulate() as FORCE_POPULATION_TYPE);

    updatedPopulatedProduct = await this.populateSlug(updatedPopulatedProduct, true);

    const eventsPromises: Array<Promise<any[]>> = [];
    eventsPromises.push(
      this.eventDispatcher.dispatch(ProductsEventsEnum.ProductUpdated, oldProduct, updatedPopulatedProduct),
    );

    this.productBusAdapter.processProductVariants(
      oldProduct,
      variantsDiff.delete,
      (vp: ProductDocumentLikeDto) => {
        eventsPromises.push(this.eventDispatcher.dispatch(ProductsEventsEnum.ProductRemoved, vp));
      });

    this.productBusAdapter.processProductVariants(
      oldProduct,
      createdVariants,
      (vp: ProductDocumentLikeDto) => {
        eventsPromises.push(this.eventDispatcher.dispatch(ProductsEventsEnum.ProductCreated, vp, true));
      });

    await Promise.all(eventsPromises);
    this.productTranslationService.upsertTranslation(updatedPopulatedProduct).catch();
    this.productCountrySettingService.upsertCountrySetting(updatedPopulatedProduct, recommendations).catch();

    let result: any = { ...updatedPopulatedProduct.toObject() };
    result = SaleHelper.saleDateFormat(result);

    return result;
  }

  public async upsertProduct(dto: ProductDto): Promise<PopulatedVariantsCategoryCollectionsChannelSetProductModel> {
    const product: PopulatedVariantsProductModel = await this.getProductByBusinessAndSku(dto.businessId, dto.sku);
    if (product) {
      dto.id = product.id;
      let i: number = 0;
      for (const dtoVariant of dto.variants) {
        for (const dbVariant of product.variants) {
          if (dtoVariant.sku === dbVariant.sku) {
            dto.variants[i].id = dbVariant.id;
          }
        }

        i++;
      }

      return this.updateFromDto(dto);
    }

    return this.createFromDto(dto);
  }

  public async addProductImage(businessId: string, sku: string, imageUrl: string): Promise<ProductModel> {
    const product = await this.getProductByBusinessAndSku(businessId, sku);
    const updatedProduct: ProductModel = await this.productModel.findOneAndUpdate(
      { _id: product._id },
      {
        $push: {
          images: imageUrl,
        },
      },
    );

    return updatedProduct;
  }

  public async setProductCategory(id: string, categories: ProductCategoryInterface[]): Promise<ProductModel> {
    const updatedProduct: ProductModel = await this.productModel.findByIdAndUpdate(id, { categories });
    this.productTranslationService.upsertTranslation(updatedProduct).catch();

    return updatedProduct;
  }

  public async setProductsCurrency(businessId: string, currency: string): Promise<any> {
    return this.productModel
      .updateMany(
        { businessId },
        {
          $set: { currency },
        },
      )
      .exec();
  }

  public async getProductByBusinessAndSku(businessId: string, sku: string): Promise<PopulatedVariantsProductModel> {
    return (await this.productModel.findOne({
      businessId,
      sku,
    }).populate('variants')) as FORCE_POPULATION_TYPE;
  }

  public async getProductByBusinessAndId(businessId: string, possibleId: string): Promise<ProductModel> {
    return this.productModel.findOne({
      $and: [
        { businessId },
        {
          $or: [
            { uuid: possibleId },
            { id: possibleId },
            { _id: possibleId },
          ],
        },
      ],
    });
  }

  // tslint:disable-next-line:cognitive-complexity
  public async getProducts(
    businessId: string,
    sort: SortDto[],
    pagination: PaginationDto,
    filter: FilterDto = {},
  ): Promise<ProductsPaginatedInterface> {
    const { search, filters, excludeIds, includeIds, withMarketplaces }: any = filter;
    const query: any = this.getProductQuery(businessId, filter);

    const productsPaginated: ProductsPaginatedInterface = await this.newProductService.getProductsPaginated(
      businessId,
      query,
      pagination,
      sort,
    );

    if (!productsPaginated.products.length) {
      await this.productNotificationsService.sendAddProductNotification(businessId);
    } else if (Object.keys(query).find((key: string) => /(^marketplaces\.)\w+/.test(key)) || withMarketplaces) {
      const businessMarketplaces: MarketplaceModel[] = await this.marketplaceService.getBusinessMarketplaces(
        businessId,
      );

      productsPaginated.products = productsPaginated.products.map((p: ProductModel) => {
        const marketplaces: ProductMarketplaceInterface[] = businessMarketplaces
          .filter((m: MarketplaceModel) => (m.subscription ? m.subscription.installed : true))
          .map((m: MarketplaceModel) => {
            const foundedMarketplace: any = p.marketplaces.find(
              (marketplaceModel: any) => marketplaceModel._id === m._id,
            );
            const activated: boolean = !!foundedMarketplace;
            const marketplace: ProductMarketplaceInterface = {
              activated: activated,
              connected: null,
              id: m._id,
              name: m.name,
              type: m.type,
            };
            if (m.type === MarketplaceTypeEnum.MARKET) {
              marketplace.connected = m.subscription.connected;
              marketplace.name = m.subscription.name;
            }

            return marketplace;
          });
        p.marketplaces = marketplaces;

        return p;
      });
    }

    const skus: string[] = productsPaginated.products.map((p: ProductModel) => p.sku);
    let stocks: { [key: string]: number } = {};
    try {
      stocks = await this.getInventoriesStocks(businessId, skus);
    } catch (e) {
      this.logger.log('failed to get stock');
    }

    const business: BusinessModel = await this.businessService.getById(businessId);

    productsPaginated.products = await Promise.all(productsPaginated.products.map(async (p: any) => {
      p.stock = stocks[p.sku];
      p.category = (await this.categoryService.getByIdAndBusiness(p.category, p.businessId)) as FIX_MISTYPING;
      p.variantCount = p.variants.length;
      p.imageUrl = p.imagesUrl[0];
      p.priceAndCurrency = `${p.currency} ${p.price}`;
      p.salePriceAndCurrency = `${p.currency} ${p.sale?.salePrice}`;

      p.business = {
        _id: p.businessId,
        companyAddress: business?.companyAddress,
      };

      p.company = business?.name;
      p = SaleHelper.saleDateFormat(p);

      return p;
    }));

    return productsPaginated;
  }

  public async getForAdmin(query: ProductQueryDto)
    : Promise<{ documents: ProductModel[]; page: number; total: number }> {

    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const sort: any = query.sort || { createdAt: 1 };
    const skip: number = (page - 1) * limit;

    const conditions: any = {};

    if (query.businessIds) {
      conditions.businessId = { $in: Array.isArray(query.businessIds) ? query.businessIds : [query.businessIds] };
    }

    const documents: ProductModel[] = await this.productModel
      .find(conditions)
      .select(query.projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const total: number = await this.productModel.count(conditions).exec();

    return {
      documents,
      page,
      total,
    };
  }

  public async getChannelSetCategories(
    businessId: string, 
    sku: string
  ): Promise<ProductChannelSetCategoriesInterface[]> {
    const product: ProductModel = await this.findOne({businessId, sku});
    
    return product?.channelSetCategories;
  }

  public async updateForAdminBySku(
    businessId: string,
    sku: string,
    productDto: ProductDto,
  ): Promise<PopulatedVariantsCategoryCollectionsChannelSetProductModel> {

    const product: ProductModel = await this.productModel.findOne({ businessId: businessId, sku: sku });
    if (!product) {
      throw new NotFoundException(`product with {businessId: ${businessId}, sku: ${sku}} does not exist`);
    }

    return this.updateForAdmin(product.id, productDto);
  }

  public async updateForAdmin(
    productId: string,
    productDto: ProductDto,
  ): Promise<PopulatedVariantsCategoryCollectionsChannelSetProductModel> {
    productDto.id = productId;

    return this.updateFromDto(productDto);
  }

  public async export(productId: string): Promise<void> {
    const product: ProductModel = await this.productModel.findById(productId);
    await this.productsEventsProducer.productExported(product);
  }

  public async lastProductBusinessUpdatedAt(
    business: string,
  ): Promise<any> {
    const product: ProductModel = await this.productModel
      .findOne({ businessId: business })
      .sort({ updatedAt: -1 });

    return {
      result: product.updatedAt.toISOString(),
    };
  }

  public async listProductIdsByBusiness(
    business: string,
  ): Promise<any> {
    const products: ProductModel[] = await this.productModel
      .find({ businessId: business }).select('_id');

    return {
      result: products.map((product: ProductModel) => product._id),
    };
  }

  public async getBuilderCategoriesByProducts(
    business: string,
    filter: any,
    order: any,
    offset: number = 0,
    limit: number = 10,
  ): Promise<any> {
    let filterData: any = filter ? filter : [];
    filterData = typeof filter === 'string' && filter !== '' ? JSON.parse(filter) : [];
    const filterDB: any = {
      filters: filterData,
    };

    const queryProduct: any = this.getProductQuery(business, filterDB);

    const categoriesIds: string[] = await this.productModel
      .distinct('category', queryProduct)
      .lean();

    const query: any = {
      _id: { $in: categoriesIds },
    };

    const orderBy: { [propName: string]: 1 | -1 } = {};
    if (order) {
      let orderData: any = order;
      orderData = typeof order === 'string' && order !== '' ? JSON.parse(order) : [];
      for (const data of orderData) {
        orderBy[data.field] = data.direction === 'asc' ? 1 : -1;
      }
    }

    return this.categoryService.fetchCategoriesForBuilder(query, orderBy, limit, offset);
  }

  public async getUsedBuilderCategories(
    businessId: string,
    filter: string,
    order: string = '',
    pagination: PaginationDto = { limit: 0, page: 1 },
  ): Promise<any> {
    const queryBuilder: any = new QueryBuilder(CategoryFilterFieldsMapping);
    const { page, limit }: { page: number; limit: number } = pagination;
    const skip: number = (page - 1) * limit;

    let filterData: any = filter ? filter : [];
    filterData = typeof filter === 'string' && filter !== '' ? JSON.parse(filter) : [];

    let categoriesIds: string[] = await this.productModel
      .distinct('category', {
        businessId: businessId,
      })
      .lean();

    categoriesIds = categoriesIds.filter(n => n);

    const query: any = {
      _id: { $in: categoriesIds },
      ...queryBuilder.buildQuery(filterData),
    };

    const orderBy: { [propName: string]: 1 | -1 } = {};
    if (order) {
      const orderData: any = (typeof order === 'string' && order !== '') ? JSON.parse(order) : order;
      for (const data of orderData) {
        orderBy[data.field] = data.direction === 'asc' ? 1 : -1;
      }
    }

    return this.categoryService.fetchCategoriesForBuilder(query, orderBy, limit, skip);
  }

  public async getProductsByCategory(
    businessId: string,
    categories: string[],
    pagination: PaginationDto,
    sort: any,
  ): Promise<ProductsPaginatedInterface> {
    const query: any = {
      businessId,
      'categories._id': { $in: categories },
    } as any;

    return this.getProductsPaginated(query, pagination, sort);
  }

  public async getUsedProductCategories(businessId: string, titleFilter: string = ''): Promise<ProductCategoryDto[]> {
    return this.productModel
      .distinct('categories', {
        businessId,
        'categories.title': {
          $options: 'i',
          $regex: `(.+)?${titleFilter}(.+)?`,
        },
      })
      .lean();
  }

  public async getProductsByChannelSet(
    businessId: string,
    sort: SortDto,
    pagination: PaginationDto,
    filter: FilterDto,
  ): Promise<ProductsPaginatedInterface> {
    const {
      search,
      filters,
      allBusinesses,
      channelSetType,
      existInChannelSet,
      channelSetId,
      excludeIds,
      includeIds,
    }: any = filter;

    const queryBuilder: any = new QueryBuilder(ProductFilterFieldsMapping);
    let query: any = {
      ...queryBuilder.buildQuery(filters),
    };

    if (!allBusinesses) {
      query.businessId = businessId;
    }

    query.channelSets = await this.getQueryChannelSet(existInChannelSet, channelSetId, channelSetType);

    if (excludeIds && excludeIds.length > 0) {
      query.uuid = QueryBuilder.mergeQuery({ $nin: excludeIds }, query.uuid);
    }

    if (includeIds && includeIds.length > 0) {
      query.uuid = QueryBuilder.mergeQuery({ $in: includeIds }, query.uuid);
    }

    if (search) {
      const searchQuery: any = QueryBuilder.buildStringContainsQuery(search);
      if (query.title) {
        query = {
          ...query,
          ...QueryBuilder.combineQueries({ title: query.title }, { title: searchQuery }),
        };
        delete query.title;
      } else {
        query.title = searchQuery;
      }
    }

    const productsPaginated: ProductsPaginatedInterface = await this.getProductsPaginated(query, pagination, sort);

    // true when has existing products which not yet imported into channel set
    let isChannelWithExisting: boolean = false;
    if (existInChannelSet) {
      isChannelWithExisting = !!(await this.productModel
        .findOne({
          businessId: businessId,
          'channelSets.id': { $nin: [channelSetId] },
        })
        .exec());
    }

    productsPaginated.info.isChannelWithExisting = isChannelWithExisting;

    return productsPaginated;
  }

  public async getProductsByMarketplace(
    businessId: string,
    sort: SortDto,
    pagination: PaginationDto,
    filter: FilterDto,
  ): Promise<ProductsPaginatedInterface> {
    const { search, filters, existInMarketplace, marketplaceId, excludeIds, includeIds }: any = filter;

    const queryBuilder: any = new QueryBuilder(ProductFilterFieldsMapping);
    let query: any = {
      businessId,
      ...queryBuilder.buildQuery(filters),
    };

    if (marketplaceId) {
      if (existInMarketplace) {
        query['marketplaces.marketplaceId'] = { $eq: marketplaceId };
      } else {
        query['marketplaces.marketplaceId'] = { $ne: marketplaceId };
      }
    }

    if (excludeIds && excludeIds.length > 0) {
      query._id = QueryBuilder.mergeQuery({ $nin: excludeIds }, query._id);
    }

    if (includeIds && includeIds.length > 0) {
      query._id = QueryBuilder.mergeQuery({ $in: includeIds }, query._id);
    }

    if (search) {
      const searchQuery: any = QueryBuilder.buildStringContainsQuery(search);
      if (query.title) {
        query = {
          ...query,
          ...QueryBuilder.combineQueries({ title: query.title }, { title: searchQuery }),
        };
        delete query.title;
      } else {
        query.title = searchQuery;
      }
    }

    return this.getProductsPaginated(query, pagination, sort);
  }

  public async removeProductBySku(businessId: string, productSku: string): Promise<void> {
    const product: ProductModel = await this.productModel.findOne({
      $and: [
        {
          businessId: businessId,
        },
        {
          sku: productSku,
        },
      ],
    });

    if (product) {
      await this.removeProducts([product.id]);
    } else {
      const variedProduct: ProductModel = await this.productModel.findOne({
        $and: [
          {
            businessId: businessId,
          },
          {
            'variants.sku': productSku,
          },
        ],
      });

      if (!variedProduct) {
        return;
      }

      const index: number = product.variants.findIndex((v: FIX_MISTYPING) => v.sku === productSku);
      variedProduct.variants.splice(index, 1);
      variedProduct.markModified('variants');

      await variedProduct.save();
    }
  }

  public async removeProducts(ids: string[]): Promise<number> {
    const session: ClientSession = await this.productModel.db.startSession();
    let result: number = 0;
    await session.withTransaction(async () => {
      const products: PopulatedVariantsProductModel[] = (await this.productModel
        .find({ _id: { $in: ids } })
        .populate('variants')
        .session(session)) as FORCE_POPULATION_TYPE;

      const variants: string[] = products.reduce(
        (p: string[], c: PopulatedVariantsProductModel) =>
          Array.isArray(c.variants) ? p.concat(c.variants.map((x: ProductVariantModel) => x._id)) : p,
        [],
      );

      await this.variantModel.deleteMany({ _id: { $in: variants } }).session(session);
      await this.recommendationsModel.deleteMany({ productId: { $in: ids } }).session(session);

      const deletionResult: { n?: number } = await this.productModel.deleteMany({ _id: { $in: ids } }).session(session);
      const productsRemoved: Array<PopulatedVariantsProductModel | ProductDocumentLikeDto> = [];

      if (deletionResult.n) {
        for (const product of products) {
          productsRemoved.push(product);

          this.productBusAdapter.processProductVariants(
            product,
            product.variants,
            (vp: ProductDocumentLikeDto) => {
              productsRemoved.push(vp);
            });
        }

        result = deletionResult.n;
      }

      Promise.all(
        productsRemoved?.map((product) => this.eventDispatcher.dispatch(ProductsEventsEnum.ProductRemoved, product)
        )).catch();
    });

    await this.marketplaceAssigmentService.removeAllFromProducts(ids);

    return result;
  }

  public async updateProductsToChannelSet(
    businessId: string,
    channelSets: ProductChannelSetInterface[],
    addToProductIds: string[],
    removeFromProducts: string[],
  ): Promise<void> {
    const newChannelSets: string[] = [];
    for (const channelSet of channelSets) {
      const newChannelSetModel: ChannelSetModel =
        await this.channelSetService.findOrCreate(channelSet.id, businessId, channelSet);
      newChannelSets.push(newChannelSetModel.id);
    }

    // add channel set to products
    await this.productModel.updateMany(
      {
        _id: { $in: addToProductIds },
      },
      {
        $push: {
          channelSets: { $each: newChannelSets },
        } as any,
      },
    );

    // remove channel set from products
    await this.productModel.updateMany(
      {
        _id: { $in: removeFromProducts },
      },
      {
        $pull: {
          channelSets: { $in: newChannelSets },
        } as any,
      },
    );

    return Promise.resolve(null);
  }

  public async updateProductsToMarketplace(
    marketplaces: ProductMarketplaceInterface[],
    addToProductIds: string[],
    removeFromProducts: string[],
  ): Promise<void> {
    const marketplaceIds: string[] = marketplaces.map((m: ProductMarketplaceInterface) => m.id);
    const addToProductModels: ProductModel[] = await this.productModel
      .find({ uuid: { $in: addToProductIds } })
      .populate('marketplaceAssigments')
      .exec();
    const productsNotAssignedMarketplaces: ProductModel[] = addToProductModels.filter(
      (p: ProductModel) =>
        p.marketplaceAssigments.filter((m: MarketplaceAssigmentInterface) => marketplaceIds.includes(m.marketplaceId))
          .length === 0,
    );
    const marketplaceAssigments: MarketplaceAssigmentInterface[] = productsNotAssignedMarketplaces.flatMap(
      (product: ProductModel) =>
        marketplaceIds.map((marketplaceId: string) => ({ productUuid: product._id, marketplaceId })),
    );
    await this.marketplaceAssigmentService.createMany(marketplaceAssigments);
    await this.marketplaceAssigmentService.removeMarketplacesFromProducts(removeFromProducts, marketplaceIds);
  }

  public async isSkuUsed(sku: string, businessId: string, productId: string): Promise<boolean> {
    const isSkuUsed: boolean = await this.productBaseService.isSkuUsed(businessId, sku, productId);
    if (isSkuUsed) {
      const msg: string = `Product with sku already exists`;
      this.logger.log({
        context: 'ProductService.IsSkuUsed',
        message: msg,
      });
      throw new UserInputError(msg);
    }

    return isSkuUsed;
  }

  public async getProductsPaginated(
    query: object,
    pagination: PaginationDto = { page: 1, limit: 0 },
    sort: SortDto,
    withMarketplaces: boolean = false,
  ): Promise<ProductsPaginatedInterface> {
    const { page, limit }: any = pagination;
    const skip: number = (page - 1) * limit;

    const orderBy: any = {} as { [propName: string]: 1 | -1 };
    orderBy[sort.field] = sort.direction === 'asc' ? 1 : -1;

    if (orderBy.hasOwnProperty('price')) {
      orderBy.sortPrice = orderBy.price;
      delete orderBy.price;
    }

    let productsPaginated: any = await this.productModel
      .aggregate([
        {
          $lookup: {
            as: 'marketplaces',
            foreignField: 'productUuid',
            from: 'marketplaceassigments',
            localField: '_id',
          },
        },
        { $match: query },
        {
          $facet: {
            pageInfo: [
              {
                $match: query,
              },
              {
                $group: {
                  _id: null,
                  count: { $sum: 1 },
                },
              },
            ],
            products: [
              {
                $match: query,
              },
              {
                $addFields: {
                  sortPrice: {
                    $cond: {
                      else: '$salePrice',
                      if: {
                        $eq: ['$hidden', true],
                      },
                      then: '$price',
                    },
                  },
                },
              },
              {
                $sort: orderBy,
              },
              {
                $skip: skip,
              },
              {
                $limit: limit,
              },
            ],
          },
        },
        { $project: { products: { _id: true }, pageInfo: true } },
      ])
      .exec();

    productsPaginated = productsPaginated.pop();
    productsPaginated.pageInfo = productsPaginated.pageInfo.pop();
    const itemCount: number = productsPaginated.pageInfo ? productsPaginated.pageInfo.count : 0;
    const pageCount: number = productsPaginated.pageInfo ? Math.ceil(itemCount / limit) : 0;

    let products: ProductInterface[] = [];
    if (Array.isArray(productsPaginated.products)) {
      products = await Promise.all(productsPaginated.products.map((x: any) => this.newProductService.get(x._id)));
    }

    return {
      info: {
        pagination: {
          item_count: itemCount,
          page,
          page_count: pageCount,
          per_page: limit,
        },
      },
      products: products as any,
    };
  }

  public async getProductsList(
    query: object,
    pagination: PaginationDto = { page: 1, limit: 0 },
    sort: SortDto,
    populate: string[] = ['variants'],
  ): Promise<ProductModel[]> {
    const { page, limit }: { page: number; limit: number } = pagination;
    const skip: number = (page - 1) * limit;

    const listPromise: any = this.productModel
      .find(query)
      .skip(skip)
      .limit(limit);

    if (sort) {
      const orderBy: { [propName: string]: 1 | -1 } = {};
      orderBy[sort.field] = sort.direction === 'asc' ? 1 : -1;
      listPromise.sort(orderBy);
    }

    if (populate) {
      for (const populateField of populate) {
        listPromise.populate(populateField);
      }
    }

    return listPromise;
  }

  public async removeByBusinessId(businessId: string): Promise<void> {
    const products: ProductModel[] = await this.productModel.find({ businessId: businessId });
    const deletionResult: { n?: number } = await this.productModel.deleteMany({ businessId: businessId });
    if (deletionResult.n > 0) {
      const productsEvents: Array<Promise<any>> = [];
      for (const product of products) {
        productsEvents.push(this.eventDispatcher.dispatch(ProductsEventsEnum.ProductRemoved, product));
        this.productBusAdapter.processProductVariants(
          product,
          product.variants as FIX_MISTYPING,
          (vp: ProductDocumentLikeDto) => {
            productsEvents.push(this.eventDispatcher.dispatch(ProductsEventsEnum.ProductRemoved, vp));
          });
      }

      await Promise.all(productsEvents);
    }
  }

  public mapImages(images: string[]): string[] {
    return (images || []).map((name: string) => `${environment.storage}/products/${name}`);
  }

  public mapVideos(videos: string[]): string[] {
    return (videos || []).map((name: string) => `${environment.storage}/products/${name}`);
  }

  public async fillVatRatesForBusinessProducts(vatRate: number, businessId: string): Promise<void> {
    await this.productModel.updateMany(
      {
        $or: [{ vatRate: { $exists: false } }, { vatRate: null }],
        businessId: businessId,
      },
      {
        $set: {
          vatRate: vatRate,
        },
      },
    );
  }

  public async lockProduct(productId: string, businessId: string): Promise<void> {
    const product: ProductModel = await this.productModel.findOneAndUpdate(
      {
        _id: productId,
        businessId: businessId,
      },
      {
        $set: {
          isLocked: true,
        },
      },
    );

    if (!product) {
      await this.variantModel.findOneAndUpdate(
        {
          _id: productId,
          businessId: businessId,
        },
        {
          $set: {
            isLocked: true,
          },
        },
      );
    }
  }

  public async removeAllSampleProducts(businessId: string): Promise<void> {
    const sampleProducts: ProductModel[] = await this.productModel.find({
      businessId: businessId,
      example: true,
    });
    const sampleProductsIds: string[] = sampleProducts.map((p: ProductModel) => p.id);
    await this.removeProducts(sampleProductsIds);
  }

  public async createDefaultCollection(businessId: string): Promise<CollectionModel> {
    const createCollectionDtoForAllFolder: CreateCollectionDto = {
      activeSince: new Date(),
      automaticFillConditions: { strict: false, filters: [] },
      channelSets: [],
      description: 'All',
      name: 'All',
      parent: '',
      slug: 'All',
    };

    return this.collectionsService.create(createCollectionDtoForAllFolder, businessId);
  }

  public async createSampleProducts(businessDto: BusinessDto): Promise<void> {
    const businessId: string = businessDto._id;
    const industry: string = businessDto.companyDetails ? businessDto.companyDetails.industry : null;
    const product: string = businessDto.companyDetails ? businessDto.companyDetails.product : null;
    const collection: CollectionModel = await this.createDefaultCollection(businessId);
    const sampleProducts: SampleProductInterface[] = await this.sampleProductService.getSampleProducts(
      industry,
      product,
    );
    const products: Array<LeanDocument<PopulatedVariantsCategoryCollectionsChannelSetProductModel>> = [];
    for (const sp of sampleProducts) {
      sp.businessId = businessId;

      try {
        const productModel: PopulatedVariantsCategoryCollectionsChannelSetProductModel = await this.createFromDto(
          await SampleProductConverter.toProductDto(sp),
        );
        await this.associateProductWithCollections(
          productModel,
          [collection],
        );
        products.push(productModel as FORCE_POPULATION_TYPE);
      } catch (error) {
        this.logger.error({
          context: 'SampleProductsService',
          message: 'Create Sample ' + error,
        });
      }

      this.logger.log({
        context: 'SampleProductsService',
        message: 'Create Sample',
      });
    }
    if (products.length) {
      await this.eventDispatcher.dispatch(SampleProductsEventsEnum.SampleProductsCreated, businessDto, products);
    }
  }

  public async deactivateProduct(id: string): Promise<ProductModel> {
    return this.productModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          active: false,
        },
      },
      { new: true },
    );
  }

  public async removeAllChannelSet(channelSetId: string): Promise<void> {
    await this.productModel.updateMany(
      { 'channelSets.id': channelSetId },
      {
        $pull: {
          channelSets: channelSetId,
        },
      },
    );
  }

  public async removeCollectionFromProducts(collection: CollectionModel): Promise<void> {
    await this.productModel.updateMany(
      {
        collections: collection.id,
      },
      {
        $pull: { collections: collection.id },
      },
    );
  }

  public async associateProductsWithCollection(collection: CollectionModel, ids: string[]): Promise<void> {
    await this.productModel.updateMany(
      {
        _id: {
          $in: ids,
        },
      },
      {
        $addToSet: { collections: collection.id },
      },
    );
  }

  public async associateProductWithCollections(
    product: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
    collections: CollectionModel[],
  ): Promise<void> {
    await this.productModel.findOneAndUpdate(
      { _id: product.id },
      {
        $addToSet: { collections: { $each: collections } },
      },
    );
  }

  public async dissociateProductWithCollections(
    product: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
    collections: CollectionModel[],
  ): Promise<void> {
    for (const collection of collections) {
      await this.productModel.findOneAndUpdate(
        { _id: product.id },
        {
          $pull: { collections: collection.id },
        },
      );
    }
  }

  public async updateCategory(product: ProductModel, category: CategoryModel): Promise<ProductModel> {
    return this.productModel.findOneAndUpdate(
      { _id: product.id },
      {
        $set: { category: category },
      },
    );
  }

  public async updateOldCategories(product: ProductModel, categories: CategoryModel[]): Promise<ProductModel> {
    const productCategory: ProductCategoryInterface[] = categories.map(
      (category: CategoryModel) => {
        return {
          _id: category.id,
          businessId: category.businessId,
          slug: category.slug,
          title: category.title,
        };
      },
    );

    return this.productModel.findOneAndUpdate(
      { _id: product.id },
      {
        $set: { categories: productCategory },
      },
    );
  }

  public async copyProducts(
    businessId: string,
    productIds: string[],
    targetCollectionId: string,
    prefix: string,
    targetFolderId?: string,
  ): Promise<ProductsPaginatedInterface> {
    const productModels = await this.productModel.find(
      {
        _id: { $in: productIds },
        businessId: businessId,
      },
    );

    const resultModels: ProductModel[] = [];

    for (const product of productModels) {
      const originalProduct = product.toObject();
      const {
        _id,
        variants,
        createdAt,
        updatedAt,
        ...produtDto
      }: Record<string, any> = originalProduct;

      const [
        titleCounter,
        skuCounter,
        slugCounter,
        collectionModel,
      ]: [number, number, number, CollectionModel] = await Promise.all([
        this.counterService.getNextCounter(businessId, originalProduct.title, 'product-title'),
        this.counterService.getNextCounter(businessId, originalProduct.sku, 'product-sku'),
        this.counterService.getNextCounter(businessId, originalProduct.slug, 'product-slug'),
        this.collectionsService.getByIdAndBusiness(targetCollectionId, businessId),
      ]);

      const copyPrefix = prefix ?? 'copy';
      const copiedProductDto = {
        ...produtDto,
        title: `${originalProduct.title}-${copyPrefix}-${titleCounter}`,
        sku: `${originalProduct.sku}-${copyPrefix}-${skuCounter}`,
        slug: `${originalProduct.slug}-${copyPrefix}-${slugCounter}`,
        collections: collectionModel ? [collectionModel.id] : [],
      };
      const productCopy: ProductModel = await this.productModel.create(copiedProductDto);

      await this.productVariantsService.duplicateVariants(variants, productCopy._id);
      await productCopy.populate('collections').execPopulate();

      await this.eventDispatcher.dispatch(
        FoldersEventsEnum.FolderActionCreateDocument,
        {
          ...productCopy.toObject(),
          name: productCopy.toObject().title,
          parentFolderId: targetFolderId,
          serviceEntityId: productCopy.toObject()._id,
        },
      );

      resultModels.push(productCopy);
    }

    return {
      info: {
        pagination: {
          item_count: resultModels.length,
          page: 1,
          page_count: 1,
          per_page: resultModels.length,
        },
      },
      products: resultModels,
    };
  }

  public async getInventoriesStocks(business: string, skus: string[]): Promise<{ [key: string]: number }> {
    const url: string = `${environment.microUrlInventory}/api/business/${business}/inventory/sku/stock`;
    const response: Observable<AxiosResponse<any>> = this.httpService.post(
      url,
      {
        skus: skus,
      },
    );

    return response.pipe(
      map(async (res: any) => {
        return res.data;
      }),
      catchError((error: AxiosError) => {
        this.logger.error({
          error: error,
          message: 'Failed to get stocks',
          url: url,
        });

        throw error;
      }),
    ).toPromise();
  }

  public async findOne(filter: FilterQuery<ProductModel>): Promise<ProductModel> {
    return this.productModel.findOne(filter);
  }

  public async populateSlug(
    product: PopulatedVariantsCategoryCollectionsChannelSetProductModel,
    isUpdate: boolean = false,
  ): Promise<PopulatedVariantsCategoryCollectionsChannelSetProductModel> {
    if (product.slug && isUpdate === false) {
      return product;
    }

    const firstCategory: string = product.categories && product.categories[0] && product.categories[0].title ? `${product.categories[0].title} ` : '';
    const firstVariant: string = product.variants && product.variants[0] && product.variants[0].title ? `${product.variants[0].title} ` : '';
    let slug: string = slugify(`${firstCategory}${firstVariant}${product.title}`).toLowerCase();
    if (slug === product.slug) {
      return product;
    }

    const existingSlug: ProductModel = await this.productModel.findOne(
      {
        businessId: product.businessId,
        slug,
      },
    );
    if (existingSlug && existingSlug._id !== product._id) {
      slug += '-' + ('00000' + ((new Date()).getTime() % Math.pow(36, 5)).toString(36)).substr(-5);
    }

    await this.productModel.findOneAndUpdate(
      {
        _id: product._id,
      },
      {
        $set: {
          slug,
        },
      },
    );

    product.slug = slug;

    return product;
  }

  private getProductQuery(businessId: string, filter: FilterDto = {}): any {
    const { search, filters, excludeIds, includeIds }: any = filter;

    const queryBuilder: any = new QueryBuilder(ProductFilterFieldsMapping);
    let query: any = {
      ...queryBuilder.buildQuery(filters),
    };

    if (businessId) {
      query.businessId = businessId;
    }

    if (Array.isArray(includeIds) && includeIds.length) {
      query._id = QueryBuilder.mergeQuery({ $in: includeIds }, query._id);
    }

    if (excludeIds && excludeIds.length > 0) {
      query._id = QueryBuilder.mergeQuery({ $nin: excludeIds }, query._id);
    }

    if (search) {
      const searchQuery: any = QueryBuilder.buildStringContainsQuery(search);
      if (query.title) {
        query = {
          ...query,
          ...QueryBuilder.combineQueries({ title: query.title }, { title: searchQuery }),
        };
      } else {
        query.title = searchQuery;
      }
    }

    return query;
  }

  private async filterAndPrepareMarketplaces(
    product: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  ): Promise<MarketplaceAssigmentInterface[]> {
    const businessMarketplaces: MarketplaceModel[] = await this.marketplaceService.getBusinessMarketplaces(
      product.businessId,
    );

    return product.marketplaces
      .filter((productMarketplace: ProductMarketplaceInterface) => {
        const marketplace: MarketplaceModel = businessMarketplaces.find(
          (m: MarketplaceModel) => m._id === productMarketplace.id,
        );
        if (marketplace) {
          if (marketplace.type === MarketplaceTypeEnum.MARKET) {
            return marketplace.subscription.installed && marketplace.subscription.connected;
          }

          return true;
        }

        return false;
      })
      .map((m: ProductMarketplaceInterface) => ({ productUuid: product._id, marketplaceId: m.id }));
  }

  // tslint:disable-next-line:cognitive-complexity
  private async validate(product: ProductDto, existing: PopulatedVariantsProductModel = null): Promise<void> {
    if (product.sku) {
      await this.isSkuUsed(product.sku, product.businessId, product.id);
    }
    const usedSku: Map<string, boolean> = new Map();
    if (product.sku) {
      usedSku.set(product.sku, true);
    }
    if (product.variants) {
      for (const variant of product.variants) {

        if (!variant.sku && !product.sku) {
          const msg: string = 'Either product sku or variant sku must be provided';
          this.logger.log({
            context: 'ProductService.Validate',
            message: msg,
          });
          throw new UserInputError(msg);
        }

        if (!variant.sku) {
          continue;
        }

        await this.isSkuUsed(variant.sku, product.businessId, variant.id);

        if (usedSku.has(variant.sku)) {
          const msg: string = `Sku "${variant.sku}" is already used`;
          this.logger.log({
            context: 'ProductService.Validate',
            message: msg,
          });
          throw new UserInputError(msg);
        }

        usedSku.set(variant.sku, true);
      }
    }

    if (!product.sku && !(product.variants && product.variants.length)) {
      const msg: string = 'Code / SKU is a required field';
      this.logger.log({
        context: 'ProductService.Validate',
        message: msg,
      });
      throw new UserInputError(msg);
    }

    const business: BusinessModel = await this.businessService.getById(product.businessId);

    const country: string = product.country ? product.country :
      (existing && existing.country ? existing.country : business?.companyAddress?.country);

    if (product?.vatRate && country) {
      await this.assertVatRateExistsForCountry(product, country);
    }
  }

  private async assertVatRateExistsForCountry(product: ProductDto, country: string): Promise<void> {

    if (product.example) {
      return;
    }

    if (!(await this.taxService.isTaxRateExists(country, product.vatRate))) {
      const msg: string = `Tax rate "${product.vatRate}" doesn't exists in country "${country}"`;
      this.logger.log({
        context: 'ProduceService.AssertVatRateExistsForCountry',
        message: msg,
      });
      throw new UserInputError(msg);
    }
  }

  private async getProductMarketplaces(product: ProductModel): Promise<ProductMarketplaceInterface[]> {
    const businessMarketplaces: MarketplaceModel[] = await this.marketplaceService.getBusinessMarketplaces(
      product.businessId,
    );
    const productMarketplaceAssigments: MarketplaceAssigmentModel[]
      = await this.marketplaceAssigmentService.findByProductUuid(
        product._id,
      );
    const productMarketplaceIds: string[] = productMarketplaceAssigments.map(
      (m: MarketplaceAssigmentModel) => m.marketplaceId,
    );

    return businessMarketplaces
      .filter((m: MarketplaceModel) => (m.subscription ? m.subscription.installed : true))
      .map((m: MarketplaceModel) => {
        const activated: boolean = productMarketplaceIds.indexOf(m._id) !== -1;
        const marketplace: ProductMarketplaceInterface = { id: m.id, name: m.name, type: m.type, activated };
        if (m.type === MarketplaceTypeEnum.MARKET) {
          marketplace.name = m.subscription.name;
          marketplace.connected = m.subscription.connected;
        }

        return marketplace;
      });
  }

  private async updateProductMarketplaces(
    product: PopulatedVariantsProductModel,
    marketplaces: ProductMarketplaceDto[],
  ): Promise<any> {
    const businessMarketplaces: MarketplaceModel[] = await this.marketplaceService.getBusinessMarketplaces(
      product.businessId,
    );
    const productMarketplaceAssigments: MarketplaceAssigmentModel[]
      = await this.marketplaceAssigmentService.findByProductUuid(
        product._id,
      );
    const productMarketplaceIds: string[] = productMarketplaceAssigments.map(
      (m: MarketplaceAssigmentModel) => m.marketplaceId,
    );
    if (productMarketplaceIds.length) {
      await this.marketplaceAssigmentService.removeMany(product._id, productMarketplaceIds);
    }
    const newMarketplaceAssigments: MarketplaceAssigmentInterface[] = marketplaces
      .map((m: ProductMarketplaceInterface) => m.id)
      .filter((id: string) => {
        const marketplace: MarketplaceModel = businessMarketplaces.find((m: MarketplaceModel) => m._id === id);
        if (marketplace && marketplace.type === MarketplaceTypeEnum.MARKET) {
          return marketplace.subscription.connected;
        }

        return true;
      })
      .map((id: string) => ({ productUuid: product._id, marketplaceId: id }));
    const marketplaceAssigmentModels: MarketplaceAssigmentModel[] = await this.marketplaceAssigmentService.createMany(
      newMarketplaceAssigments,
    );
    const marketplaceIds: string[] = marketplaceAssigmentModels.map((m: MarketplaceAssigmentModel) => m.marketplaceId);

    return businessMarketplaces
      .filter((m: MarketplaceModel) => (m.type === MarketplaceTypeEnum.MARKET ? m.subscription : true))
      .filter((m: MarketplaceModel) => (m.subscription ? m.subscription.installed : true))
      .map((m: MarketplaceModel) => {
        const activated: boolean = marketplaceIds.indexOf(m._id) !== -1;
        const marketplace: ProductMarketplaceInterface = { id: m.id, name: m.name, type: m.type, activated };
        if (m.type === MarketplaceTypeEnum.MARKET && m.subscription) {
          marketplace.name = m.subscription.name;
          marketplace.connected = m.subscription.connected;
        }

        return marketplace;
      });
  }

  private mapVariantsFromProduct(
    variants: ProductVariantsDto[],
    product: ProductModel | PopulatedVariantsProductModel,
  ): ProductVariantsDto[] {
    if (!variants) {
      return [];
    }

    const variantSkuToId: Map<string, string> = new Map();
    product.variants.forEach((x: string | ProductVariantModel) => {
      if (typeof x === 'string') {
        return;
      }
      if (x.sku) {
        variantSkuToId.set(x.sku, x.id);
      }
    });

    let variantNumber: number = 1;

    return variants.map((variantDto: ProductVariantsDto) => {
      const variantId: string = variantDto.id || (variantSkuToId.has(variantDto.sku) &&
        variantSkuToId.get(variantDto.sku)) || null;

      const variant: any = {
        ...variantDto,
        _id: variantId,
        businessId: product.businessId,
        id: variantId,
        priceTable: this.priceTableSaleMap(variantDto.priceTable),
        product: product._id,
        sale: this.convertSaleDtoToDate(variantDto.sale, variantDto.price),
        sku: variantDto.sku || `${product.sku}_${variantNumber}`,
      };

      if (!variant._id) {
        delete variant._id;
      }

      variantNumber++;

      return variant;
    });
  }

  private async createProductVariants(
    product: ProductModel,
    variants: ProductVariantsDto[],
    session: ClientSession,
  ): Promise<void> {
    if (Array.isArray(variants)) {
      const vDocs: ProductVariantModel[] = await this.variantModel.create(
        this.mapVariantsFromProduct(variants, product),
        { session },
      );

      product.variants = vDocs as any;
      await product.depopulate('variants').execPopulate();
    } else {
      delete product.variants;
    }
  }

  private async diffItems(
    oldItems: LeanProductVariant[],
    newItems: ProductVariantsDto[],
    productId: string,
    oldLanguage: string,
    newLanguage: string,
  ): Promise<{ create: ProductVariantsDto[]; delete: LeanProductVariant[]; update: ProductVariantsDto[] }> {
    if (!Array.isArray(oldItems)) {
      oldItems = [];
    }

    if (!Array.isArray(newItems)) {
      newItems = [];
    }

    if (newLanguage && oldLanguage !== newLanguage) {
      const translation: TranslationInterface = await this.productTranslationService.getProductTranslation(
        productId,
        newLanguage,
      );
      if (translation) {
        oldItems = await this.productVariantsService.getVariantByIds(translation.variants as any);
      } else {
        oldItems = [];
      }
    }

    const oldIds: Map<string, LeanProductVariant> = new Map(
      oldItems.filter((x: LeanProductVariant) => x && x.id).map((x: LeanProductVariant) => [x.id, x]),
    );
    const newIds: Map<string, ProductVariantsDto> = new Map(
      newItems.filter((x: ProductVariantsDto) => x && x.id).map((x: ProductVariantsDto) => [x.id, x]),
    );

    let itemsToCreate: ProductVariantsDto[] = newItems.filter((x: ProductVariantsDto) => !x.id || !oldIds.has(x.id));
    const itemsToDelete: LeanProductVariant[] = [...oldIds.keys()]
      .filter((x: string) => !newIds.has(x))
      .map((x: string) => oldIds.get(x));
    const itemsToUpdate: ProductVariantsDto[] = [...newIds.keys()]
      .filter((x: string) => oldIds.has(x))
      .map((x: string) => newIds.get(x));

    const dump: ProductVariantsDto[] = [];
    for (const item of itemsToCreate) {
      const existing: ProductVariantModel = await this.productVariantsService.getVariant(item.id);
      if (existing) {
        itemsToUpdate.push(item);
      } else {
        dump.push(item);
      }
    }
    itemsToCreate = dump;

    return {
      create: itemsToCreate,
      delete: itemsToDelete,
      update: itemsToUpdate,
    };
  }

  private async getInventoryStock(business: string, sku: string): Promise<number> {
    const url: string = `${environment.microUrlInventory}/api/business/${business}/inventory/sku/${sku}/stock`;
    const response: Observable<AxiosResponse<any>> = this.httpService.get(url);

    return response.pipe(
      map(async (res: any) => {
        return res.data;
      }),
    ).toPromise();
  }

  private integrationBuilderFormat(products: any[]): ProductModel[] {
    return products.map((product: any) => {
      product.priceAndCurrency
        = product.priceAndCurrency ? this.convertPriceAndCurrency(product.priceAndCurrency) : null;
      product.salePriceAndCurrency = product.salePriceAndCurrency ?
        (
          this.convertPriceAndCurrency(product.salePriceAndCurrency) === '' ?
            this.convertPriceAndCurrency(product.priceAndCurrency) :
            this.convertPriceAndCurrency(product.salePriceAndCurrency)
        )
        : null;

      delete product.apps;
      delete product.channelSets;
      delete product.business;
      delete product.businessUuid;
      delete product.businessId;

      return product;
    });
  }

  private convertPriceAndCurrency(data: string): string {
    const arr: string[] = data.split(' ');
    if (isNaN(arr[1] as any)) {
      return '';
    }

    const dec: string = parseFloat(arr[1]).toFixed(2);

    return `${arr[0]} ${dec}`;
  }

  private async getQueryChannelSet(
    existInChannelSet: boolean,
    channelSetId: string,
    channelSetType: string,
  ): Promise<any> {
    let queryChannelSet: any;

    if (existInChannelSet) {
      queryChannelSet = { $in: [channelSetId] };
    } else {
      queryChannelSet = { $nin: [channelSetId] };
    }

    if (channelSetType) {
      const channelSets: string[] = (await this.channelSetService.findByType(channelSetType)).map(
        (channelSet: ChannelSetModel) => {
          return channelSet._id;
        },
      );

      if (existInChannelSet) {
        queryChannelSet = { $in: channelSets };
      } else {
        queryChannelSet = { $nin: channelSets };
      }
    }

    return queryChannelSet;
  }

  private priceTableSaleMap(priceTable: any): any[] {
    if (!priceTable) {
      return [];
    }

    return priceTable.map((price: ProductPriceDto) => {
      const result: any = { ...price };
      if (result.sale) {
        result.sale = this.convertSaleDtoToDate(price.sale, price.price);
      }

      return result;
    }) || [];
  }

  private convertSaleDtoToDate(sale: any, price: number): any {
    if (!sale) {
      return;
    }

    return {
      ...sale,
      saleEndDate: sale.saleEndDate ? new Date(sale.saleEndDate) : null,
      salePrice: sale.salePercent ? (100 - sale.salePercent) / 100 * price : sale.salePrice,
      saleStartDate: sale.saleStartDate ? new Date(sale.saleStartDate) : null,
    };
  }

  private salePriceFromPercent(productDto: ProductDto): ProductDto {
    productDto.sale.salePrice
      = productDto.sale.salePercent ?
        (100 - productDto.sale.salePercent) / 100 * productDto.price :
        productDto.sale.salePrice;

    productDto.priceTable = productDto.priceTable?.map((priceTable: ProductPriceDto) => {
      const priceData: any = { ...priceTable };
      priceData.sale.salePrice = priceTable.sale.salePercent ?
        (100 - priceTable.sale.salePercent) / 100 * priceTable.price : priceTable.sale.salePrice;

      return priceData;
    }) || [];

    return productDto;
  }

  async productDtoUpdate(productDto: ProductDto, oldProductDoc: any): Promise<{
    productDto: ProductDto;
    oldProduct: PopulatedVariantsLeanProduct;
    variantsDiff: {
      create: ProductVariantsDto[];
      delete: LeanProductVariant[];
      update: ProductVariantsDto[];
    };
  }> {

    const oldProduct: PopulatedVariantsLeanProduct = oldProductDoc.toObject();

    productDto.variants = this.mapVariantsFromProduct(productDto.variants, oldProductDoc);

    const variantsDiff = await this.diffItems(
      oldProduct.variants,
      productDto.variants,
      productDto.id,
      oldProduct.language,
      productDto.language,
    );


    this.logger.log('Mapped product variants', JSON.stringify({ variantsDiff, oldProductDoc }));

    if (!productDto.category && productDto.categories && productDto.categories.length > 0) {
      const newCategories: CategoryModel[] = await this.oldCategoriesMapper.findOrCreateCategory(
        productDto.categories,
        oldProductDoc.businessId,
      );
      productDto.category = newCategories && [0] ? newCategories[0].id : null;
      productDto.categories = newCategories.map(
        (newCategory: CategoryModel) => ({
          businessId: newCategory.businessId,
          id: newCategory.id,
          slug: newCategory.slug,
          title: newCategory.title,
        }),
      );
    }

    if (oldProduct.example || productDto.example) {
      productDto.example = false;
    }

    return {
      productDto,
      oldProduct,
      variantsDiff,
    };
  }

  async updateProductDtoTransaction(
    productDto: ProductDto,
    oldProductDoc: PopulatedVariantsProductModel,
    oldProduct: PopulatedVariantsLeanProduct,
    variantsDiff: {
      create: ProductVariantsDto[];
      delete: LeanProductVariant[];
      update: ProductVariantsDto[];
    },
    itemsToCreate: ProductVariantsDto[],
    session: ClientSession
  ): Promise<{
    updatedProduct: PopulatedVariantsProductModel;
    recommendations: ProductRecommendationsModel;
    createdVariants: ProductVariantModel[];
  }> {
    let createdVariants: ProductVariantModel[];
    let recommendations: ProductRecommendationsModel;

    const variantIds: string[] = [];

    if (variantsDiff.delete.length) {
      const idsToDelete: string[] = variantsDiff.delete.map((x: any) => x.id);
      await this.variantModel.deleteMany({ _id: { $in: idsToDelete } }).session(session);
    }

    if (variantsDiff.create.length) {
      createdVariants = await this.variantModel.create(itemsToCreate, { session });
      for (let i: number = 0; i < createdVariants.length; i++) {
        variantsDiff.create[i].id = createdVariants[i].id;
        variantIds.push(createdVariants[i].id);
      }
    }

    if (variantsDiff.update.length) {
      for (const v of variantsDiff.update) {
        const doc: ProductVariantModel = await this.variantModel.findById(v.id).session(session);
        Object.assign(doc, v);
        await doc.save();
        variantIds.push(v.id);
      }
    }

    if (Array.isArray(productDto.categories)) {
      for (const category of productDto.categories) {
        (category as any)._id = category.id;
      }
    }

    const newChannelSets: string[] = [];
    let dropshipping: boolean = false;
    if (productDto.channelSets && productDto.channelSets.length) {
      for (const channelSet of productDto.channelSets) {
        if (channelSet.type === ChannelTypeEnum.Dropshipping) {
          dropshipping = true;
        }

        const newChannelSetModel: ChannelSetModel =
          await this.channelSetService.findOrCreate(channelSet.id, productDto.businessId, channelSet);
        newChannelSets.push(newChannelSetModel.id);
      }
      delete productDto.channelSets;
    }

    Object.assign(oldProductDoc, productDto, { variants: variantIds });
    oldProductDoc.channelSets = newChannelSets;
    oldProduct.dropshipping = dropshipping;

    if (productDto.recommendations) {
      recommendations = await this.recommendationsModel.findOneAndUpdate(
        {
          productId: productDto.id,
        },
        {
          businessId: productDto.businessId,
          recommendations: productDto.recommendations.recommendations,
          sku: productDto.sku,
          tag: productDto.recommendations.tag,
        } as any,
        {
          new: true,
          session,
          setDefaultsOnInsert: true,
          upsert: true,
        },
      );
    } else {
      await this.recommendationsModel.deleteOne(
        {
          productId: productDto.id,
        },
      ).session(session);
    }

    const set: any = { ...oldProductDoc.toObject() };
    delete set._id;
    delete set.__v;
    delete set.createdAt;
    delete set.updatedAt;
    delete set.uuid;
    delete set.businessUuid;
    delete set.id;

    await this.productModel.findOneAndUpdate(
      { _id: productDto.id },
      { $set: set },
      { session },
    );

    const updatedProduct: PopulatedVariantsProductModel = oldProductDoc;

    if (productDto.marketplaces && productDto.marketplaces.length) {
      updatedProduct.marketplaces = await this.updateProductMarketplaces(updatedProduct, productDto.marketplaces);
    }

    return {
      updatedProduct,
      recommendations,
      createdVariants,
    };
  }
}
