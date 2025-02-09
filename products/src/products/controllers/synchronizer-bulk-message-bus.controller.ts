import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { environment } from '../../environments';
import { MessageBusRoutingKeys } from '../../shared';
import { ImportProductDto } from '../dto/import-product';
import { ImportBulkProductMessageDto, ImportProductMessageDto } from '../dto/synchronizer-rabbit';
import { ProductSynchronizationService } from '../services';

@Controller()
export class SynchronizerBulkMessageBusController {
  constructor(private readonly synchronizationService: ProductSynchronizationService) { }

  @MessagePattern({
    channel: environment.rabbitProductQueueName,
    routingKey: MessageBusRoutingKeys.ProductRoutingKeyInward,
    name: 'synchronizer.event.outer-products.upserted',
  })
  public async outerProductsUpserted(
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

    if (payloadDto.synchronization.isFinished) {
      process.exit(0);
    }
  }
}
