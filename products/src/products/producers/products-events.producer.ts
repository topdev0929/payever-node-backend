import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import {
  PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  PopulatedVariantsLeanProduct,
  PopulatedVariantsProductModel,
  ProductModel,
} from '../models';
import { ProductSkuRemovedDto, ProductSkuUpdatedDto } from '../dto';
import { RabbitEventNameEnum } from '../../environments/rabbitmq';
import { ImportProductDto } from '../dto/import-product';
import { ProductDocumentLikeDto } from '../../bus/product-export-bus.dto';
import { ElasticProductConverter } from '../converters';
import { SynchronizeTaskDto } from '../dto/synchronizer-rabbit';

@Injectable()
export class ProductsEventsProducer {
  constructor(private readonly rabbitClient: RabbitMqClient) { }

  public async productExported(product: ProductModel): Promise<void> {
    await this.triggerEvent('products.event.product.exported', product.toObject());
  }

  public async productCreated(
    product: PopulatedVariantsCategoryCollectionsChannelSetProductModel | ProductDocumentLikeDto,
  ): Promise<void> {
    await this.triggerEvent('products.event.product.created', { ...product.toObject(), inventory: product.inventory });
  }

  public async inwardSyncSuccess(synchronization: SynchronizeTaskDto): Promise<void> {
    await this.triggerEvent('products.event.product-synchronization.finished', synchronization);
  }

  public async productUpdated(
    originalProduct: ProductModel | PopulatedVariantsLeanProduct,
    product: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
    synchronization?: SynchronizeTaskDto,
  ): Promise<void> {
    await this.triggerEvent('products.event.product.updated', { synchronization, ...(product.toObject())});
  }

  public async skuUpdated(
    originalProduct: ProductModel | PopulatedVariantsLeanProduct,
    product: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  ): Promise<void> {
    if (product.example) {
      return;
    }
    const skuUpdatedDto: ProductSkuUpdatedDto = {
      business: {
        id: product.businessId,
      },
      originalSku: originalProduct.sku,
      updatedSku: product.sku,
    };
    await this.triggerEvent('products.event.product.sku-updated', skuUpdatedDto);
  }

  public async productSynchronizationSucceeded(
    product: PopulatedVariantsCategoryCollectionsChannelSetProductModel,
    taskId: string,
  ): Promise<void> {
    if (!taskId) {
      return;
    }

    await this.triggerEvent(RabbitEventNameEnum.ProductSynchronizationSucceeded, {
      product: {
        sku: product.sku,
      },
      synchronizationTask: {
        id: taskId,
      },
    });
  }

  public async productSynchronizationFailed(
    productDto: ImportProductDto,
    taskId: string,
    errorMessage: string,
  ): Promise<void> {
    if (!taskId) {
      return;
    }

    await this.triggerEvent(RabbitEventNameEnum.ProductSynchronizationFailed, {
      errorMessage,
      product: {
        sku: productDto.sku,
      },
      synchronizationTask: {
        id: taskId,
      },
    });
  }

  public async productRemoved(
    product: ProductModel | ProductDocumentLikeDto | PopulatedVariantsProductModel,
  ): Promise<void> {
    await this.triggerEvent('products.event.product.removed', product.toObject());
  }

  public async skuRemoved(
    product: ProductModel | ProductDocumentLikeDto | PopulatedVariantsProductModel,
  ): Promise<void> {
    if (product.example) {
      return;
    }
    const skuRemovedDto: ProductSkuRemovedDto = {
      business: {
        id: product.businessId,
      },
      sku: product.sku,
    };

    await this.triggerEvent('products.event.product.sku-removed', skuRemovedDto);
  }

  public async slugPopulated(
    product: PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  ): Promise<void> {
    await this.triggerEvent('product.event.slug.populated', ElasticProductConverter.productToElastic(product));
  }

  public async triggerEvent(eventName: string, payload: any): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: eventName,
        exchange: 'async_events',
      },
      {
        name: eventName,
        payload,
      },
    );
  }
}
