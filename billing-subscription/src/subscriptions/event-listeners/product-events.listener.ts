import { Injectable } from '@nestjs/common';
import { ProductModel } from '../models';
import { EventListener } from '@pe/nest-kit';
import { ProductEventsEnum } from '../enums';

@Injectable()
export class ProductEventsListener {
  constructor() { }

  @EventListener(ProductEventsEnum.ProductCreated)
  public async onProductCreated(product: ProductModel): Promise<void> {
    await product.populate('business').execPopulate();
  }

  @EventListener(ProductEventsEnum.ProductUpdated)
  public async onProductUpdated(updatedProduct: ProductModel): Promise<void> {
    await updatedProduct.populate('business').execPopulate();
  }
}
