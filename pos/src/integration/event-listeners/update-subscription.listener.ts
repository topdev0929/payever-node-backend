import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessModel } from '../../business';
import { InternalEventsEnum } from '@pe/channels-sdk';
import { BusinessIntegrationSubscriptionService, IntegrationService } from '../services';
import { IntegrationModel } from '../models';
import { BusinessService } from '@pe/business-kit';
import { ToggleIntegrationSubscriptionDto } from '../dto';

@Injectable()
export class UpdateSubscriptionListener {
  constructor (
    private readonly subscriptionService: BusinessIntegrationSubscriptionService,
    private readonly integrationService: IntegrationService,
    private readonly businessService: BusinessService,
  ) { }

  @EventListener({ eventName: InternalEventsEnum.onIntegrationEnabledEvent, priority: 0} )
  public async onIntegrationEnabled(toggleSubDto: ToggleIntegrationSubscriptionDto): Promise<void> {
    const integration: IntegrationModel = await this.integrationService.findOneByName(toggleSubDto.name);
    if (!integration) {
      return;
    }

    const business: BusinessModel =
      await this.businessService.findOneById(toggleSubDto.businessId) as BusinessModel;
    if (!business) {
      return;
    }

    await this.subscriptionService.install(integration, business);
  }

  @EventListener({ eventName: InternalEventsEnum.onIntegrationDisabledEvent, priority: 0} )
  public async onIntegrationDisabled(toggleSubDto: ToggleIntegrationSubscriptionDto): Promise<void> {
    const integration: IntegrationModel = await this.integrationService.findOneByName(toggleSubDto.name);
    if (!integration) {
      return;
    }

    const business: BusinessModel =
      await this.businessService.findOneById(toggleSubDto.businessId) as BusinessModel;
    if (!business) {
      return;
    }

    await this.subscriptionService.uninstall(integration, business);
  }
}
