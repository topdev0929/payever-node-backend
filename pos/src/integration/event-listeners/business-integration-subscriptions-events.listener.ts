import { Injectable } from '@nestjs/common';
import { BusinessEvent } from '@pe/channels-sdk';
import { EventListener } from '@pe/nest-kit';
import { BusinessModel } from '../../business/models';
import { BusinessIntegrationSubscriptionService } from '../services';

@Injectable()
export class BusinessIntegrationSubscriptionsEventsListener {
  constructor(
    private readonly businessIntegrationSubscriptionService: BusinessIntegrationSubscriptionService,
  ) { }

  @EventListener(BusinessEvent.BusinessRemoved)
  public async handleBusinessRemoved(business: BusinessModel): Promise<void> {
    await this.businessIntegrationSubscriptionService.deleteAllByBusiness(business);
  }
}
