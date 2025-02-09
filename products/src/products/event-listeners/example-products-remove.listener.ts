import { Injectable } from '@nestjs/common';
import { ProductsEventsEnum } from '../enums';
import { PopulatedVariantsLeanProduct, PopulatedVariantsCategoryCollectionsChannelSetProductModel, ProductModel } from '../models';
import { EventListener } from '@pe/nest-kit';
import { ProductService } from '../services/product.service';
import { ProductDocumentLikeDto } from '../../bus/product-export-bus.dto';

@Injectable()
export class ExampleProductsRemoverListener {
  constructor(private readonly productsService: ProductService) { }

  @EventListener(ProductsEventsEnum.ProductCreated)
  public async handleProductCreated(
    product: PopulatedVariantsCategoryCollectionsChannelSetProductModel | ProductDocumentLikeDto,
  ): Promise<void> {
    if (!product.example) {
      await this.productsService.removeAllSampleProducts(product.businessId);
    }
  }

  @EventListener(ProductsEventsEnum.ProductUpdated)
  public async handleProductUpdated(
    originalProduct: ProductModel | PopulatedVariantsLeanProduct,
    updatedProduct: ProductModel | PopulatedVariantsCategoryCollectionsChannelSetProductModel,
  ): Promise<void> {
    if (!updatedProduct.example) {
      await this.productsService.removeAllSampleProducts(updatedProduct.businessId);
    }
  }
}
