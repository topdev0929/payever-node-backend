import { Controller, forwardRef, Inject, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BusinessService } from '@pe/business-kit';

import { BusinessModel } from '../../../business';
import { CartItemInterface } from '../interfaces';
import { BusinessProductsService } from '../services';
import { CreateProductDto, UpdateProductDto } from '../dto';
import { RemoveProductDto } from '../dto/remove-product.dto';

@Controller()
export class ProductsBusMessageController {
  constructor(
    private readonly logger: Logger,
    private readonly businessService: BusinessService,
    @Inject(forwardRef(() => BusinessProductsService))
    private readonly businessProductsService: BusinessProductsService,
  ) { }

  @MessagePattern({
    name: 'products.event.product.created',
  })
  public async onProductCreateEvent(data: CreateProductDto): Promise<void> {
    const business: BusinessModel = await this.businessService
    .findOneById(data.businessUuid) as unknown as BusinessModel;

    if (!business) {
      return;
    }

    const cartItem: CartItemInterface = {
      _id: data.uuid,
      identifier: data.identifier, // have no transactions yet
      name: data.title,
      price: data.salePrice,
      price_net: data.price,
      quantity: 0,
      thumbnail: data.images[0],
      uuid: data.uuid,
      vat_rate: 0,
    };

    await this.businessProductsService.processCartItem(business, cartItem, data.createdAt);
  }

  @MessagePattern({
    name: 'products.event.product.updated',
  })
  public async onProductUpdatedEvent(product: UpdateProductDto): Promise<void> {
    await this.businessProductsService.updateCartItem(product, new Date().toString());
  }

  @MessagePattern({
    name: 'products.event.product.removed',
  })
  public async onProductRemovedEvent(removeProduct: RemoveProductDto): Promise<void> {
    await this.businessProductsService.removeUuid(removeProduct._id, removeProduct.businessUuid);
  }
}
