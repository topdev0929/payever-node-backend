import { Injectable } from '@nestjs/common';
import { ProductsEventsEnum } from '../enums';
import {
  PopulatedVariantsLeanProduct,
  PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  PopulatedVariantsProductModel,
  ProductModel,
  ProductModelName,
  ProductVariantModelName,
} from '../models';
import { ProductsEventsProducer } from '../producers';
import { MediaChangedDto, MediaContainersEnum, MediaEventsEnum } from '@pe/media-sdk';
import { EventDispatcher, EventListener } from '@pe/nest-kit';
import { ProductCountrySettingService, ProductNotificationsService, ProductTranslationService } from '../services';
import { MappedFolderItemInterface, FoldersEventsEnum } from '@pe/folders-plugin';
import { MappingHelper } from '../../folder/helpers/mapping.helper';
import { ProductDocumentLikeDto } from '../../bus/product-export-bus.dto';
import { LeanProductVariant, ProductVariantModel } from '../models/product-variant.model';
import { FIX_MISTYPING } from 'src/special-types';

@Injectable()
export class ProductEventsListener {
  constructor(
    private readonly eventDispatcher: EventDispatcher,
    private productsEventsProducer: ProductsEventsProducer,
    private readonly productNotificationsService: ProductNotificationsService,
    private readonly productTranslationService: ProductTranslationService,
    private readonly productCountrySettingService: ProductCountrySettingService,
  ) { }

  @EventListener(ProductsEventsEnum.ProductCreated)
  public async handleProductCreated(
    product: PopulatedVariantsCategoryCollectionsChannelSetProductModel | ProductDocumentLikeDto,
    isVariant: boolean = false,
  ): Promise<void> {
    await this.productsEventsProducer.productCreated(product);
    await this.triggerMediaChangedEvent([], product.images || [], product._id, ProductModelName);
    if (!isVariant) {
      const folderDocument: MappedFolderItemInterface = MappingHelper.map(product);
      await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionCreateDocument, folderDocument);
    }
    if (product.variants) {
      await this.processVariants([], product.variants);
    }
  }

  @EventListener(ProductsEventsEnum.ProductUpdated)
  public async handleProductUpdated(
    originalProduct: ProductModel | PopulatedVariantsLeanProduct,
    updatedProduct: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  ): Promise<void> {
    await this.productsEventsProducer.productUpdated(originalProduct, updatedProduct);
    if (originalProduct.sku !== updatedProduct.sku) {
      await this.productsEventsProducer.skuUpdated(originalProduct, updatedProduct);
    }

    const folderDocument: MappedFolderItemInterface = MappingHelper.map(updatedProduct);
    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionUpdateDocument, folderDocument);

    await this.triggerMediaChangedEvent(
      originalProduct.images,
      updatedProduct.images,
      updatedProduct._id,
      ProductModelName,
    );
    await this.processVariants(originalProduct.variants || [], updatedProduct.variants || []);
  }

  @EventListener(ProductsEventsEnum.ProductRemoved)
  public async handleProductRemoved(
    product: ProductModel | ProductDocumentLikeDto | PopulatedVariantsProductModel,
  ): Promise<void> {
    await this.productsEventsProducer.productRemoved(product);
    await this.productsEventsProducer.skuRemoved(product);
    await this.productTranslationService.removeTranslation(product._id);
    await this.productCountrySettingService.removeCountrySetting(product._id);

    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionDeleteDocument, product._id);

    await this.triggerMediaChangedEvent(product.images, [], product._id, ProductModelName);
    if (product.variants) {
      await this.processVariants(product.variants, []);
    }
  }

  private async processVariants(
    // tslint:disable-next-line: use-type-alias
    originalVariants: Array<ProductVariantModel | LeanProductVariant | string>,
    newVariants: Array<ProductVariantModel | string>,
  ): Promise<void> {
    const removedVariants: Array<ProductVariantModel | LeanProductVariant | string> = originalVariants.filter(
      (originalVariant: FIX_MISTYPING) => {
        return !newVariants.some((newVariant: FIX_MISTYPING) => newVariant._id === originalVariant._id);
      },
    );

    for (const removedVariant of removedVariants) {
      if (typeof removedVariant === 'string') { continue; }
      await this.triggerMediaChangedEvent(removedVariant.images, [], removedVariant._id, ProductVariantModelName);
    }

    for (const newVariant of newVariants) {
      if (typeof newVariant === 'string') { continue; }
      const originalVariant: ProductVariantModel | LeanProductVariant | string = originalVariants.find(
        (variant: ProductVariantModel) => variant._id === newVariant._id,
      );
      if (originalVariant) {
        if (typeof originalVariant === 'string') { continue; }
        await this.triggerMediaChangedEvent(
          originalVariant.images,
          newVariant.images,
          newVariant._id,
          ProductVariantModelName,
        );
      } else {
        await this.triggerMediaChangedEvent([], newVariant.images, newVariant._id, ProductVariantModelName);
      }
    }
  }

  private async triggerMediaChangedEvent(
    originalMedia: string[],
    newMedia: string[],
    relatedEntityId: string,
    relatedEntityType: string,
  ): Promise<void> {
    const mediaChangedDto: MediaChangedDto = {
      container: MediaContainersEnum.Products,
      originalMediaCollection: originalMedia,
      relatedEntity: {
        id: relatedEntityId,
        type: relatedEntityType,
      },
      updatedMediaCollection: newMedia,
    };

    await this.eventDispatcher.dispatch(MediaEventsEnum.MediaChanged, mediaChangedDto);
  }
}
