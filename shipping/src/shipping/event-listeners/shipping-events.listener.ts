import { Injectable, Logger } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { IntegrationSubscriptionEvent } from '../../integration/enums/integration-subscribtion.events.enum';
import { BusinessModel } from '../../business/models';
import { IntegrationSubscriptionModel } from '../../integration';
import { ShippingTriggerService } from '../services/shipping-trigger.service';
import { ShippingSettingService } from '../services';

@Injectable()
export class ShippingEventsListener {
  constructor(
    private readonly triggerService: ShippingTriggerService,
    private readonly shippingSettingService: ShippingSettingService,
    private readonly logger: Logger,
  ) { }

  @EventListener(IntegrationSubscriptionEvent.IntegrationSubscribed)
  public async handleIntegrationSubscribed(
    data: { integrationSub: IntegrationSubscriptionModel; business: BusinessModel },
  ): Promise<void> {
    this.logger.log(`EventListener sync shipping data ${data}`);
    await this.triggerService.triggerShippingDataSync(data.integrationSub, data.business);
  }

  @EventListener(IntegrationSubscriptionEvent.ThirdPartyShippingEnabled)
  public async thirdPartyShippingEnabled(
    business: BusinessModel,
  ): Promise<void> {
    this.logger.log(`New shipping created`);
    await this.shippingSettingService.createAutoProfile(business);
  }
}
