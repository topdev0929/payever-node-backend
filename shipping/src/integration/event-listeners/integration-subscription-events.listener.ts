import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessEventsEnum } from '@pe/business-kit';
import { BusinessModel } from '../../business/models';
import { IntegrationSubscriptionService } from '../services';

@Injectable()
export class IntegrationSubscriptionEventsListener {
  constructor(
    private readonly integrationSubscriptionService: IntegrationSubscriptionService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  public async handleBusinessRemoved(business: BusinessModel): Promise<void> {
    await this.integrationSubscriptionService.removeAllIntegrationSubscriptionsOfBusiness(business);
  }
}
