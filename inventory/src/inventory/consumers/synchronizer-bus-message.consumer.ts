import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BusinessModel } from '../../business/models';
import { BusinessService } from '@pe/business-kit';
import { StockChangedDto, StockSyncDto } from '../dto/rmq';
import { BusinessAwareDto } from '../dto/rmq/business-aware.dto';
import { SynchronizeService } from '../services';

@Controller()
export class SynchronizerBusMessageConsumer {
  constructor(
    private readonly businessService: BusinessService,
    private readonly synchronizeService: SynchronizeService,
  ) { }

  @MessagePattern({
    name: 'synchronizer.event.inventory.synchronize',
  })
  public async inventorySynchronize(dto: BusinessAwareDto): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(dto.business.id);
    if (!business) {
      return;
    }

    return this.synchronizeService.synchronizeStockOutward(business);
  }

  @MessagePattern({
    name: 'synchronizer.event.outer-stock.created',
  })
  public async outerStockSynchronize(dtos: StockSyncDto[]): Promise<void> {
    for (const dto of dtos) {
      const business: BusinessModel = await this.businessService.findOneById(dto.business.id);
      if (!business) {
        return;
      }
      await this.synchronizeService.createIfNotExists(business, dto);
   }
  }

  @MessagePattern({
    name: 'synchronizer.event.outer-stock.upserted',
  })
  public async outerStockUpsertedSynchronize(dtos: StockSyncDto[]): Promise<void> {
    for (const dto of dtos) {
      const business: BusinessModel = await this.businessService.findOneById(dto.business.id);
      if (!business) {
        return;
      }
      await this.synchronizeService.upsertStock(business, dto);
    }
  }

  @MessagePattern({
    name: 'synchronizer.event.outer-stock.added',
  })
  public async outerStockAdded(dto: StockChangedDto): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(dto.business.id);
    if (!business) {
      return;
    }

    await this.synchronizeService.addStock(business, dto);
  }

  @MessagePattern({
    name: 'synchronizer.event.outer-stock.subtracted',
  })
  public async outerStockSubtracted(dto: StockChangedDto): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(dto.business.id);
    if (!business) {
      return;
    }

    await this.synchronizeService.subtractStock(business, dto);
  }
}
