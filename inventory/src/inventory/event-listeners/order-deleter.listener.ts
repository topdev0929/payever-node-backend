import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessEventsEnum } from '@pe/business-kit';
import { BusinessModel } from '../../business/models';
import { OrderService } from '../services';

@Injectable()
export class OrderDeleterListener {
  constructor(
    private readonly orderService: OrderService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  private async handleBusinessRemoved(business: BusinessModel): Promise<void> {
    await this.orderService.deleteAllByBusiness(business);
  }
}
