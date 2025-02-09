import { Injectable } from '@nestjs/common';
import { Command } from '@pe/nest-kit/modules/command';
import { IntegrationModel, IntegrationService } from '../../integration';
import { CheckoutIntegrationSubModel, CheckoutModel } from '../models';
import { CheckoutService } from '../services';
import { RabbitEventsProducer } from '../../common/producer';
import { CheckoutIntegrationSubscriptionService } from '../../common/services';

@Injectable()
export class CheckoutIntegrationsCheckCommand {
  constructor(
    private readonly checkoutIntegrationSubscriptionService: CheckoutIntegrationSubscriptionService,
    private readonly rabbitEventsProducer: RabbitEventsProducer,
    private readonly checkoutService: CheckoutService,
    private readonly integrationService: IntegrationService,
  ) { }

  @Command({
    command: 'checkout:integrations:check',
    describe: `Check all checkout's integrations`,
  })
  public async check(): Promise<void> {
    let start: number = 0;
    const limit: number = 1000;
    const count: number = await this.checkoutService.countCheckouts();
    const integrations: IntegrationModel[] = await this.integrationService.findAll();

    while (start < count) {
      const checkouts: CheckoutModel[] = await this.checkoutService.findMany(start, limit, { _id: 1 });
      for (const checkout of checkouts) {
        const integrationPromises: Array<Promise<void>> = [];
        for (const integration of integrations) {
          integrationPromises.push(this.rabbitEventsProducer.checkoutIntegrationDisabled(integration, checkout));
        }
        await Promise.all(integrationPromises);

        const subscriptions: CheckoutIntegrationSubModel[] =
          await this.checkoutIntegrationSubscriptionService.getSubscriptionsWithIntegrations(checkout);

        const subscriptionPromises: Array<Promise<void>> = [];
        for (const subscription of subscriptions) {
          if (subscription.installed) {
            subscriptionPromises.push(
              this.rabbitEventsProducer.checkoutIntegrationEnabled(subscription.integration, checkout),
            );
          }
        }
        await Promise.all(subscriptionPromises);
      }
      start += limit;
    }
  }
}
