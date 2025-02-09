import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import {
  PaginationDto,
  ProductCategoryDto,
  ProductDto,
  ProductVariantsDto,
  SortDirectionEnum,
  SortDto,
} from '../dto';
import {
  PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  PopulatedVariantsProductModel,
  ProductCategoryModel,
  ProductModel,
} from '../models';
import { ProductsEventsProducer } from '../producers';
import { ProductSettingsService } from './product-settings.service';
import * as convert from 'convert-units';
import { ProductService } from './product.service';
import { ImportProductMessageDto, SynchronizeTaskDto } from '../dto/synchronizer-rabbit';
import { ImportProductDto, ShippingDimensionsDto } from '../dto/import-product';
import { RemoveProductDto } from '../dto/synchronizer-rabbit/remove-product.dto';
import { CategoryModel } from '../../categories/models';
import { CategoryService } from '../../categories/services';
import { ProductCategoriesService } from './product-categories.service';
import { ProductCopyImageService } from './product-copy-image.service';
import { ProductChannelSetDto } from '../dto/product-channel-set.dto';
import { ChannelSetModel } from '../../channel-set/models';
import { ChannelSetService } from '../../channel-set/services';
import { ProductChannelSetCategoriesInterface } from '../interfaces';

const CONSUMER_SCRIPT_PATH: string = 'deploy/sync-consumer.sh';

@Injectable()
export class ProductSynchronizationService {
  constructor(
    private readonly logger: Logger,
    private readonly productsService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly productCategoryService: ProductCategoriesService,
    private readonly productSettingsService: ProductSettingsService,
    private readonly productsEventsProducer: ProductsEventsProducer,
    private readonly productCopyImageService: ProductCopyImageService,
    private readonly channelSetService: ChannelSetService,
  ) { }

  // tslint:disable-next-line:cognitive-complexity
  public async convertImportPayloadToDto(
    businessId: string,
    product: ImportProductDto,
    mappedCategories?: { [p: string]: ProductCategoryDto },
  ): Promise<ProductDto> {
    if (!mappedCategories) {
      mappedCategories = await this.findOrCreateCategories(businessId, product.categories);
    }

    product.images = await this.productCopyImageService.importImages(product.images, businessId, false);

    product.variants = product.variants || [];

    for (const k in product.variants) {
      if (product.variants.hasOwnProperty(k)) {
        product.variants[k].images = await this.productCopyImageService.importImages(
          product.variants[k].images,
          businessId,
          false,
        );
      }
    }

    this.logger.log({
      context: 'ProductSynchronizationService',
      mappedCategories,
      message: 'Mapped import product categories and downloaded images',
      product,
    });

    const categories: ProductCategoryDto[] =
      product.categories instanceof Array
        ? product.categories.map((categoryName: string) => {
          return mappedCategories[categoryName];
        })
        : undefined;

    const mappedCategory: CategoryModel = product.category
      ? await this.categoryService.findOrCreateByNameAndBusiness(product.category, businessId)
      : null;

    const mappedSubcategory: CategoryModel = product.subcategories && product.subcategories.length > 0
      ? await this.categoryService.findOrCreateByNameAndBusiness(product.subcategories[0], businessId, mappedCategory)
      : null;

    const productCategory: CategoryModel = mappedSubcategory || mappedCategory;

    if (product.shipping) {
      const settingsSizeUnit: string = await this.productSettingsService.getSizeUnit(businessId);
      const settingsMassUnit: string = await this.productSettingsService.getMassUnit(businessId);
      product.shipping.measure_size = product.shipping.measure_size || settingsSizeUnit;
      product.shipping.measure_mass = product.shipping.measure_mass || settingsMassUnit;
      product.shipping = this.convertShippingDimensions(product.shipping, settingsSizeUnit, settingsMassUnit);
    }

    const channelSets: ProductChannelSetDto[] = [];
    if (product.channelSets) {
      for (const channelSet of product.channelSets) {
        let channelSetModel: ChannelSetModel = await this.channelSetService.findOneById(channelSet);
        if (!channelSetModel) {
          channelSetModel = (await this.channelSetService
            .findByTypeAndBusiness(channelSet, { id: businessId } as any))[0];
        }
        if (channelSetModel) {
          channelSets.push({
            id: channelSetModel.id,
            name: channelSetModel.id,
            type: channelSetModel.type,
          });
        }
      }
    }
    const channelSetCategories: ProductChannelSetCategoriesInterface[] =
    await this.productsService.getChannelSetCategories(businessId, product.sku) || [];

    const channelSetCategoriesIndex: number = channelSetCategories.findIndex(
      (channelSet) => channelSet.channelSetType === product.origin,
    );
    if (channelSetCategoriesIndex !== -1) {
      channelSetCategories[channelSetCategoriesIndex].categories = [
        ...channelSetCategories[channelSetCategoriesIndex].categories,
        ...product.categories.map((title) => ({ title })),
      ];
    } else {
      const channelSet = channelSets.find((channelSetType) => channelSetType.type === product.origin);
      channelSetCategories.push({
        channelSetId: channelSet?.id || '',
        categories: product.categories.map((title) => ({ title })),
        channelSetType: product.origin,
      });
    }
    
    return {
      active: product.active,
      attributes: product.attributes || [],
      barcode: product.barcode,
      businessId: businessId,
      businessUuid: businessId,
      categories,
      channelSetCategories,
      category: productCategory ? productCategory.id : null,
      channelSets: channelSets,
      country: product.country,
      currency: product.currency ? product.currency : await this.productSettingsService.getCurrency(businessId),
      description: product.description,
      example: false,
      images: product.images,
      language: product.language,
      origin: product.origin,
      brand: product.brand,
      condition: product.condition,
      options: product.options || [],
      price: product.price,
      sale: {
        ...product.sale,
      },
      shipping: product.shipping,
      sku: product.sku,
      title: product.title,
      type: product.type,
      variants: product.variants.map(v => ProductVariantsDto.parse(v)),
      vatRate: product.vatRate,
    };
  }

  public async createProduct(
    payload: ImportProductMessageDto,
    synchronizationTaskId: string,
  ): Promise<PopulatedVariantsCategoryCollectionsChannelSetProductModel> {
    return this.saveProductAndSendSynchronizationMessages(
      synchronizationTaskId,
      payload,
      async (): Promise<PopulatedVariantsCategoryCollectionsChannelSetProductModel> => {
        const productDto: ProductDto = await this.convertImportPayloadToDto(payload.business.id, payload.payload);

        return this.productsService.createFromDto(productDto);
      },
    );
  }

  public async updateProduct(
    payload: ImportProductMessageDto,
    synchronizationTaskId: string,
  ): Promise<PopulatedVariantsCategoryCollectionsChannelSetProductModel> {
    return this.saveProductAndSendSynchronizationMessages(
      synchronizationTaskId,
      payload,
      async (): Promise<PopulatedVariantsCategoryCollectionsChannelSetProductModel> => {
        const productDto: ProductDto = await this.convertImportPayloadToDto(payload.business.id, payload.payload);

        return this.productsService.updateFromDto(await this.fillMissingDtoFieldsFromExistingProduct(productDto));
      },
    );
  }

  public async upsertProduct(
    payload: ImportProductMessageDto,
  ): Promise<PopulatedVariantsCategoryCollectionsChannelSetProductModel> {

    return this.saveProductAndSendSynchronizationMessages(
      payload.synchronizationTask.id,
      payload,
      async (): Promise<PopulatedVariantsCategoryCollectionsChannelSetProductModel> => {
        const productDto: ProductDto = await this.convertImportPayloadToDto(payload.business.id, payload.payload);
        
        return this.productsService.upsertProduct(await this.fillMissingDtoFieldsFromExistingProduct(productDto));
      },
    );
  }

  public async removeProduct(businessId: string, product: RemoveProductDto): Promise<void> {

    return this.productsService.removeProductBySku(businessId, product.sku);
  }

  public async synchronizeProductsOutward(businessId: string, synchronization: SynchronizeTaskDto): Promise<void> {
    const pagination: PaginationDto = {
      limit: 100,
      page: 1,
    };
    const sort: SortDto = {
      direction: SortDirectionEnum.ASC,
      field: 'updatedAt',
    };

    while (true) {
      const products: ProductModel[] = await this.productsService.getProductsList(
        {
          businessId,
        },
        pagination,
        sort,
      );

      if (!products.length) {
        await this.productsEventsProducer.inwardSyncSuccess({ ...synchronization, isFinished: true });

        return;
      }

      for (const product of products) {
        await this.productsEventsProducer.productUpdated(product, product, synchronization);
      }

      pagination.page++;
    }
  }

  private async fillMissingDtoFieldsFromExistingProduct(dto: ProductDto): Promise<ProductDto> {
    let product: ProductModel | PopulatedVariantsProductModel =
      await this.productsService.getProductByBusinessAndSku(dto.businessUuid, dto.sku);

    if (!product) {
      // For products with variants and w/o SKU
      // plugins/integrations save product id inside SKU field and MIGHT send it this way
      // (hence additional check by business id)
      product = await this.productsService.getProductByBusinessAndId(dto.businessUuid, dto.sku);
    }

    if (!product) {
      return dto;
    }

    const fieldsToSave: string[] = Object.keys(dto);
    fieldsToSave.push('channelSets', 'shipping', 'uuid');

    for (const property of fieldsToSave) {
      if (typeof dto[property] === 'undefined' && typeof product[property] !== 'undefined') {
        dto[property] = product[property];
      }
    }

    if (!dto.origin) {
      dto.origin = product.origin || 'commerceos';
    }

    if (product.origin) {
      dto.origin = product.origin;
    }

    return dto;
  }

  private async findOrCreateCategories(
    businessUuid: string,
    categories: string[],
  ): Promise<{ [propName: string]: ProductCategoryDto }> {
    const map: any = {};
    if (!categories) {
      return map;
    }

    for (const name of categories) {
      if (!name) {
        continue;
      }
      let cat: ProductCategoryModel = await this.productCategoryService.findCategory(businessUuid, name);
      if (!cat) {
        cat = await this.productCategoryService.createCategory(businessUuid, name);
      }
      map[name] = {
        businessId: cat.businessId,
        businessUuid: cat.businessId,
        id: cat.id,
        slug: cat.slug,
        title: cat.title,
      };
    }

    return map;
  }

  private async saveProductAndSendSynchronizationMessages(
    synchronizationTaskId: string,
    dto: ImportProductMessageDto,
    storingCallback: () => Promise<PopulatedVariantsCategoryCollectionsChannelSetProductModel>,
  ): Promise<PopulatedVariantsCategoryCollectionsChannelSetProductModel> {
    try {
      const product: PopulatedVariantsCategoryCollectionsChannelSetProductModel = await storingCallback();

      await this.productsEventsProducer.productSynchronizationSucceeded(product, synchronizationTaskId);

      return product;
    } catch (e) {
      const message: string =
        e.name === 'MongoError' && e.code === 11000
          ? `Product with sku already exists`
          : e.message;

      await this.productsEventsProducer.productSynchronizationFailed(dto.payload, synchronizationTaskId, message);
      throw e;
    }
  }

  private convertShippingDimensions(
    shipping: ShippingDimensionsDto,
    settingsMeasureSizeUnit: string,
    settingsMeasureMassUnit: string,
  ): ShippingDimensionsDto {
    if (settingsMeasureSizeUnit !== shipping.measure_size) {
      shipping.length = convert(shipping.length)
        .from(shipping.measure_size)
        .to(settingsMeasureSizeUnit)
        .toFixed(2);
      shipping.width = convert(shipping.width)
        .from(shipping.measure_size)
        .to(settingsMeasureSizeUnit)
        .toFixed(2);
      shipping.height = convert(shipping.height)
        .from(shipping.measure_size)
        .to(settingsMeasureSizeUnit)
        .toFixed(2);
    }

    if (settingsMeasureMassUnit !== shipping.measure_mass) {
      shipping.weight = convert(shipping.weight)
        .from(shipping.measure_mass)
        .to(settingsMeasureMassUnit)
        .toFixed(2);
    }

    shipping.measure_size = settingsMeasureSizeUnit;
    shipping.measure_mass = settingsMeasureMassUnit;

    return shipping;
  }

  public async startConsumer(taskId: string, type: string): Promise<any> {
    const script = spawn(CONSUMER_SCRIPT_PATH, {
      env: {
        TASK_ID: taskId,
        TYPE: type,
        ...process.env,
      },
    });

    script.stdout.on('data', (data) => {
      this.logger.log(data.toString());
    });

    script.stderr.on('data', (data) => {
      this.logger.error(`stderr: ${data}`);
    });

    script.on('close', (code) => {
      this.logger.log(`child process exited with code ${code}`);
    });

  }
}
