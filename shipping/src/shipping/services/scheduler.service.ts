import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { BusinessModel, BusinessServiceLocal } from '../../business';
import { IntegrationSubscriptionModel, IntegrationSubscriptionService } from '../../integration';
import { ShippingTriggerService } from './shipping-trigger.service';

const SUBSCRIPTIONS_CHUNK_SIZE: number = 500;

@Injectable()
export class SchedulerService {
  constructor(
    private readonly integrationSubService: IntegrationSubscriptionService,
    private readonly businessServiceLocal: BusinessServiceLocal,
    private readonly shippingTriggerService: ShippingTriggerService,
    private readonly logger: Logger,
  ) { }

  public async triggerShippingsDataSync(): Promise<number> {
    const oneDayAgo: Date = moment().subtract(1, 'day').toDate();

    let thereAreMore: boolean = true;
    let processed: number = 0;
    let triggered: number = 0;

    while (thereAreMore) {
      const integrationSubs: IntegrationSubscriptionModel[] = await this.integrationSubService
        .findAllAwaitingShippingDataSync(
          oneDayAgo,
          SUBSCRIPTIONS_CHUNK_SIZE,
          processed,
        );

      for (const shipping of integrationSubs) {
        triggered += await this.processShipping(shipping);
      }

      thereAreMore = integrationSubs.length === SUBSCRIPTIONS_CHUNK_SIZE;
      processed += integrationSubs.length;
    }

    this.logger.log({
      context: 'SchedulerService',
      message: `Processed ${processed} shipping records, triggered ${triggered} events`,
    });

    return processed;
  }

  private async processShipping(integrationSub: IntegrationSubscriptionModel): Promise<number> {
    let triggered: number = 0;

    const business: BusinessModel = await this.businessServiceLocal
    .getBusinessByIntegrationSubscription(integrationSub);

    await this.shippingTriggerService.triggerShippingDataSync(
      integrationSub,
      business,
    );
    triggered++;

    if (triggered > 0) {
      await this.integrationSubService.setLastSyncDate(integrationSub, new Date());
    }

    return triggered;
  }
}
