import { Injectable } from '@nestjs/common';
import { BusinessEventsEnum, BusinessModel } from '@pe/business-kit';
import { SynchronizationService } from '../services';
import { EventListener } from '@pe/nest-kit';

@Injectable()
export class SynchronizationRemoverListener {

  constructor(
    private readonly synchronizationService: SynchronizationService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  private async handleBusinessRemoved(business: BusinessModel): Promise<void> {
    await this.synchronizationService.deleteAllByBusiness(business);
  }
}
