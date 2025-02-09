import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitBindingsEnum, RabbitChannelsEnum } from '../../enums';
import { ProductMessagePayloadDto } from '../../dto';
import { ProductsService, ProductSubscriptionsService } from '../../services';
import { ProductModel } from '../../interfaces/entities';

@Controller()
export class ProductsBusController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productSubscriptionService: ProductSubscriptionsService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Marketplace,
    name: RabbitBindingsEnum.ProductUpdated,
  })
  public async onProductUpdated(data: ProductMessagePayloadDto): Promise<void> {
    const marketplaceProduct: ProductModel = await this.productsService.getById(data._id);
    if (marketplaceProduct && !data.active) {
      await this.productsService.delete(marketplaceProduct);
    }
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Marketplace,
    name: RabbitBindingsEnum.ProductRemoved,
  })
  public async onProductRemoved(data: ProductMessagePayloadDto): Promise<void> {
    const marketplaceProduct: ProductModel = await this.productsService.getById(data._id);
    if (marketplaceProduct) {
      await this.productsService.delete(marketplaceProduct);
    }

    await this.productSubscriptionService.deleteSubscriptionByProductId(data._id);
  }
}
