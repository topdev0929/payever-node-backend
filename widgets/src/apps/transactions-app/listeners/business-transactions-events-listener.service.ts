import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessEventsEnum } from '@pe/business-kit';
import { BusinessModel } from '../../../business/models';
import { BusinessTransactionsService } from '../services';

@Injectable()
export class BusinessTransactionsEventsListener {

  constructor(
    private readonly businessTransactionsService: BusinessTransactionsService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  private async handleBusinessRemoved(business: BusinessModel): Promise<void> {
    await this.businessTransactionsService.deleteDailyAmount(business);
    await this.businessTransactionsService.deleteMonthlyAmount(business);
  }
}
