import { Injectable } from '@nestjs/common';

import { EventListener } from '@pe/nest-kit';
import { ProductsEventsEnum } from '../enums';
import {
  PopulatedVariantsLeanProduct,
  PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  PopulatedVariantsProductModel,
  ProductModel,
} from '../models';
import { ProductNotificationsService } from '../services';
import { ChannelSetService } from '../../channel-set/services';
import { ChannelSetModel } from '../../channel-set/models';
import { ProductDocumentLikeDto } from '../../bus/product-export-bus.dto';

@Injectable()
export class ProductNotificationsListener {
  constructor(
    private readonly productNotificationsService: ProductNotificationsService,
    private readonly channelSetService: ChannelSetService,
  ) { }

  @EventListener(ProductsEventsEnum.ProductCreated)
  public async handleProductCreated(
    product: PopulatedVariantsCategoryCollectionsChannelSetProductModel | ProductDocumentLikeDto,
  ): Promise<void> {
    if (product.channelSets) {
      await this.cancelAddProductsNotificationsForChannelSets(product);
    }
  }

  @EventListener(ProductsEventsEnum.ProductUpdated)
  public async handleProductUpdated(
    originalProduct: ProductModel | PopulatedVariantsLeanProduct,
    updatedProduct: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  ): Promise<void> {
    if (!this.hasImages(originalProduct) && this.hasImages(updatedProduct)) {
      await this.productNotificationsService.cancelMissingImageNotification(updatedProduct);
    }

    if (updatedProduct.channelSets) {
      await this.cancelAddProductsNotificationsForChannelSets(updatedProduct);
    }
  }

  @EventListener(ProductsEventsEnum.ProductRemoved)
  public async handleProductRemoved(
    product: ProductModel | ProductDocumentLikeDto | PopulatedVariantsProductModel,
  ): Promise<void> {
    await this.productNotificationsService.cancelMissingImageNotification(product);
  }

  private async cancelAddProductsNotificationsForChannelSets(
    product: ProductModel | ProductDocumentLikeDto | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  ): Promise<void> {
    for (const channelSet of product.channelSets) {
      const channelSetData: ChannelSetModel = await this.channelSetService.findOneById(channelSet);
      if (channelSetData) {
        await this.productNotificationsService.cancelChooseProductsNotifications(
          product,
          channelSetData.id,
          this.getAppByChannelSetType(channelSetData.type),
        );
      }
    }
  }

  private hasImages(
    product: ProductModel | PopulatedVariantsLeanProduct | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  ): boolean {
    return product.images && product.images.length > 0;
  }

  private getAppByChannelSetType(type: string): string {
    if (type === 'shop') {
      return 'shops';
    }

    return type;
  }
}
