import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessEventsEnum } from '@pe/business-kit';
import { BusinessModel } from '../../../business/models';
import { BusinessProductsService } from '../services';

@Injectable()
export class BusinessProductsEventsListener {

  constructor(
    private readonly businessProductsService: BusinessProductsService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  private async handleBusinessRemoved(business: BusinessModel): Promise<void> {
    await this.businessProductsService.deleteLastSoldProductsList(business);
    await this.businessProductsService.deleteProductsAggregate(business);
  }
}
