import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { ProductDocumentLikeDto } from '../../bus/product-export-bus.dto';
import { ProductsEventsEnum } from '../enums';
import {
  PopulatedVariantsLeanProduct,
  PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  PopulatedVariantsProductModel,
  ProductModel,
} from '../models';
import { ProductsElasticService } from '../services';

@Injectable()
export class ElasticIndexesUpdaterListener {
  constructor(
    private readonly productsElasticService: ProductsElasticService,
  ) { }

  @EventListener(ProductsEventsEnum.ProductCreated)
  public async handleProductCreated(
    product: PopulatedVariantsCategoryCollectionsChannelSetProductModel | ProductDocumentLikeDto,
  ): Promise<void> {
    this.productsElasticService.saveIndex(product).catch();
  }

  @EventListener(ProductsEventsEnum.ProductUpdated)
  public async handleProductUpdated(
    originalProduct: ProductModel | PopulatedVariantsLeanProduct,
    updatedProduct: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  ): Promise<void> {
    this.productsElasticService.saveIndex(updatedProduct).catch();
  }

  @EventListener(ProductsEventsEnum.ProductRemoved)
  public async handleProductRemoved(
    product: ProductModel | ProductDocumentLikeDto | PopulatedVariantsProductModel,
  ): Promise<void> {
    this.productsElasticService.deleteIndex(product).catch();
  }
}
