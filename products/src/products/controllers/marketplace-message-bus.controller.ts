import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductSubscriptionDeletedDto } from '../dto/marketplace';
import { MessageBusChannelsEnum } from '../../shared';
import { ProductService } from '../services';

@Controller()
export class MarketplaceMessageBusController {
  constructor(
    private readonly productsService: ProductService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: 'marketplace.event.product-subscription.deleted',
  })
  public async onSubscriptionDeleted(payloadDto: ProductSubscriptionDeletedDto): Promise<void> {
    await this.productsService.deactivateProduct(payloadDto.product.id);
  }
}
