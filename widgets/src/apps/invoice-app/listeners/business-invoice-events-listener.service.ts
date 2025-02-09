import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessEventsEnum } from '@pe/business-kit';
import { BusinessModel } from '../../../business/models';
import { BusinessInvoiceService } from '../services';

@Injectable()
export class BusinessInvoiceEventsListener {

  constructor(
    private readonly businessInvoiceService: BusinessInvoiceService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  private async handleBusinessRemoved(business: BusinessModel): Promise<void> {
    await this.businessInvoiceService.deleteDailyAmount(business);
    await this.businessInvoiceService.deleteMonthlyAmount(business);
  }
}
