import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessEventsEnum } from '@pe/business-kit';
import { BusinessModel } from '../../business';
import { IntegrationCategory } from '../enums';
import { BusinessIntegrationSubModel, IntegrationModel } from '../models';
import { BusinessIntegrationSubscriptionService, IntegrationService } from '../services';

@Injectable()
export class BusinessIntegrationEventsListener {
  constructor(
    private readonly integrationService: IntegrationService,
    private readonly businessSubscriptionService: BusinessIntegrationSubscriptionService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessCreated)
  public async handleBusinessCreated(business: BusinessModel): Promise<void> {
    const integrations: IntegrationModel[] =
      await this.integrationService.findByCategory(IntegrationCategory.Channels);

    if (integrations.length) {
      for (const integration of integrations) {
        await this.businessSubscriptionService.install(integration, business);
      }
    }
  }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  public async handleBusinessRemoved(business: BusinessModel): Promise<void> {
    const subscriptions: BusinessIntegrationSubModel[] =
      await this.businessSubscriptionService.findByBusiness(business);

    const tasks: Array<Promise<void>> = [];
    for (const subscription of subscriptions) {
      tasks.push(this.businessSubscriptionService.deleteOneById(subscription.id));
    }
    await Promise.all(tasks);
  }
}
