import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessEventsEnum } from '../../business/enums';
import { BusinessLocalModel } from '../../business/models';
import { IntegrationSubscriptionService } from '../services';

@Injectable()
export class IntegrationSubscriptionEventsListener {
  constructor(
    private readonly integrationSubscriptionService: IntegrationSubscriptionService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  public async handleBusinessRemoved(business: BusinessLocalModel): Promise<void> {
    await this.integrationSubscriptionService.removeAllIntegrationSubscriptionsOfBusiness(business);
  }
}
