import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessModel, BusinessEventsEnum } from '@pe/business-kit';
import { NotificationService } from '../services';

@Injectable()
export class BusinessEventListener {
  constructor(
    private readonly notificationService: NotificationService,
  ) { }
  
  @EventListener(BusinessEventsEnum.BusinessRemoved)
  public async onBusinessRemoved(business: BusinessModel): Promise<void>  {
    await this.notificationService.deleteAllForBusiness(business._id);
  }
}
