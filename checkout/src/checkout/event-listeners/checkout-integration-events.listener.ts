import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessModel } from '../../business/models';
import { IntegrationCategory, IntegrationEvent } from '../../integration/enums';
import { IntegrationModel } from '../../integration/models';
import { CheckoutEvent } from '../enums';
import { CheckoutIntegrationSubModel, CheckoutModel } from '../models';
import { CheckoutService } from '../services';
import { CheckoutIntegrationSubscriptionService } from '../../common/services';

@Injectable()
export class CheckoutIntegrationEventsListener {
  constructor(
    private checkoutService: CheckoutService,
    private checkoutIntegrationSubService: CheckoutIntegrationSubscriptionService,
  ) { }

  @EventListener(CheckoutEvent.CheckoutRemoved)
  public async handleBusinessCreated(
    checkout: CheckoutModel,
  ): Promise<void> {
    const integrationSubs: CheckoutIntegrationSubModel[] =
      await this.checkoutIntegrationSubService.getSubscriptions(checkout);

    const tasks: Array<Promise<void>> = [];
    for (const subscription of integrationSubs) {
      tasks.push(this.checkoutIntegrationSubService.deleteOneById(subscription.id));
    }
    await Promise.all(tasks);
  }

  @EventListener(IntegrationEvent.IntegrationEnabled)
  public async businessIntegrationEnabled(
    business: BusinessModel,
    integration: IntegrationModel,
  ): Promise<void> {
    if (integration.category !== IntegrationCategory.Payments) {
      return;
    }

    const tasks: Array<Promise<CheckoutIntegrationSubModel>> = [];
    const checkouts: CheckoutModel[] = await this.checkoutService.findAllByBusiness(business);
    for (const checkout of checkouts) {
      tasks.push(this.checkoutIntegrationSubService.install(integration, checkout));
    }
    await Promise.all(tasks);
  }
}
