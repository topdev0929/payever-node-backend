import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  IntegrationModel,
  ToggleIntegrationSubscriptionDto,
} from '@pe/synchronizer-kit';
import { BusinessModel } from '@pe/business-kit';

import { ToggleIntegrationSubscriptionLocalDto } from '../dto';
import { HelperService, SynchronizationService } from '../../synchronizer';
import { ConnectEventsEnum } from '../enums';

@Controller()
export class ConnectEventsConsumer {
  constructor(
    private readonly synchronizationService: SynchronizationService,
    private readonly helperService: HelperService,
  ) { }

  @MessagePattern({
    name: ConnectEventsEnum.ThirdPartyEnabled,
  })
  public async onIntegrationEnabledEvent(message: ToggleIntegrationSubscriptionDto): Promise<void> {
    const [integration, business]: [IntegrationModel, BusinessModel] =
      await this.helperService.getIntegrationAndBusiness(message.name, message.businessId);
    if (!integration || !business) { return; }
    await this.synchronizationService.enable(business._id, integration._id);
  }

  @MessagePattern({
    name: ConnectEventsEnum.ThirdPartyDisabled,
  })
  public async onIntegrationDisabledEvent(message: ToggleIntegrationSubscriptionDto): Promise<void> {
    const [integration, business]: [IntegrationModel, BusinessModel] =
      await this.helperService.getIntegrationAndBusiness(message.name, message.businessId);
    if (!integration || !business) { return; }
    await this.synchronizationService.disable(business._id, integration._id);
  }

  @MessagePattern({
    name: ConnectEventsEnum.ThirdPartyUpdateSettings,
  })
  public async onIntegrationUpdateSettingEvent(message: ToggleIntegrationSubscriptionLocalDto): Promise<void> {
    const [integration, business]: [IntegrationModel, BusinessModel] =
      await this.helperService.getIntegrationAndBusiness(message.name, message.businessId);
    if (!integration || !business) { return; }
    await this.synchronizationService.setSyncDirectionsState(
      business._id,
      integration._id,
      message.isInwardEnabled,
      message.isOutwardEnabled,
    );
  }

}
