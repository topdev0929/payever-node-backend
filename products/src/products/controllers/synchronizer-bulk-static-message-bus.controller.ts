import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MessageBusChannelsEnum } from '../../shared';
import { ImportProductDto } from '../dto/import-product';
import { ImportBulkProductMessageDto, ImportProductMessageDto } from '../dto/synchronizer-rabbit';
import { ProductSynchronizationService } from '../services';

@Controller()
export class SynchronizerBulkStaticMessageBusController {
  constructor(private readonly synchronizationService: ProductSynchronizationService) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: 'synchronizer.event.outer-products.upserted.static',
  })
  public async outerProductsUpsertedStatic(
    payloadDto: ImportBulkProductMessageDto,
  ): Promise<void> {
    const products: ImportProductDto[] = payloadDto.payload;

    for (const product of products) {
      const item: ImportProductMessageDto = {
        payload: product,
        business: payloadDto.business,
        synchronizationTask: payloadDto.synchronization,
      };

      await this.synchronizationService.upsertProduct(item);
    }
  }
}
