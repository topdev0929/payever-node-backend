import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { ProductsElasticService } from '../services';
import { MessageBusChannelsEnum } from '../../shared';
import { FIX_MISTYPING } from '../../special-types';

@Controller()
export class SlugPopulatedBusController {
  constructor(private readonly productsElasticService: ProductsElasticService) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: 'product.event.slug.populated',
  })
  public async outerProductCreated(
    data: FIX_MISTYPING,
  ): Promise<void> {
    await this.productsElasticService.indexingSlug(data);
  }
}
