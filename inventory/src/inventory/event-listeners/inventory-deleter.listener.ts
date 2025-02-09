import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessEventsEnum } from '@pe/business-kit';
import { BusinessModel } from '../../business/models';
import { InventoryService } from '../services';

@Injectable()
export class InventoryDeleterListener {
  constructor(
    private readonly inventoryService: InventoryService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  private async handleBusinessRemoved(business: BusinessModel): Promise<void> {
    await this.inventoryService.deleteAllByBusiness(business);
  }
}
