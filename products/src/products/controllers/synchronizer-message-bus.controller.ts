import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MessageBusChannelsEnum } from '../../shared';
import {
  ImportProductMessageDto,
  RemoveProductMessageDto,
  SynchronizeProductMessageDto,
} from '../dto/synchronizer-rabbit';
import { PopulatedVariantsCategoryCollectionsChannelSetProductModel } from '../models';
import { ProductSynchronizationService } from '../services';

@Controller()
export class SynchronizerMessageBusController {
  constructor(private readonly synchronizationService: ProductSynchronizationService) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: 'synchronizer.event.outer-product.created',
  })
  public async outerProductCreated(
    payloadDto: ImportProductMessageDto,
  ): Promise<PopulatedVariantsCategoryCollectionsChannelSetProductModel> {
    return this.synchronizationService.createProduct(
      payloadDto,
      payloadDto.synchronizationTask.id,
    );
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: 'synchronizer.event.outer-product.updated',
  })
  public async outerProductUpdated(
    payloadDto: ImportProductMessageDto,
  ): Promise<PopulatedVariantsCategoryCollectionsChannelSetProductModel> {
    return this.synchronizationService.updateProduct(
      payloadDto,
      payloadDto.synchronizationTask.id,
    );
  }


  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: 'synchronizer.event.outer-product.removed',
  })
  public async outerProductRemoved(dto: RemoveProductMessageDto): Promise<void> {
    return this.synchronizationService.removeProduct(dto.business.id, dto.payload);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: 'synchronizer.event.products.synchronize',
  })
  public async outwardSynchronize(dto: SynchronizeProductMessageDto): Promise<void> {
    return this.synchronizationService.synchronizeProductsOutward(dto.business.id, dto.synchronization);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.products,
    name: 'synchronizer.event.inner-sync.started',
  })
  public async onInwardSyncStarted(dto: SynchronizeProductMessageDto): Promise<void> {
    return this.synchronizationService.startConsumer(dto.synchronization.taskId, 'inward');
  }
}
