import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductSkuRemovedDto, ProductSkuUpdatedDto } from '../dto';
import { RabbitEventsEnum } from '../enums';
import { InventoryService } from '../services';
import { BusinessService, BusinessModel } from '@pe/business-kit';

@Controller()
export class ProductsBusMessageConsumer {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly businessService: BusinessService,
  ) { }

  @MessagePattern({
    name: RabbitEventsEnum.SkuUpdated,
  })
  public async onSkuUpdated(data: ProductSkuUpdatedDto): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(data.business.id);
    if (!business) {
      return;
    }

    await this.inventoryService.updateSku(data.originalSku, data.updatedSku, business);
  }

  @MessagePattern({
    name: RabbitEventsEnum.SkuRemoved,
  })
  public async onSkuRemoved(data: ProductSkuRemovedDto): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(data.business.id);
    if (!business) {
      return;
    }
    
    await this.inventoryService.removeBySku(data.sku, business);
  }
}
