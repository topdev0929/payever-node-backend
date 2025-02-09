import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { TerminalService } from '../services';
import { BusinessModel } from '../../business/models';
import { ChannelSubTypeEnum, InternalEventsEnum } from '@pe/channels-sdk';
import { OPTIONAL_CHANNEL_TYPES } from '../../common/const';
import { BusinessService } from '@pe/business-kit';
import { ToggleIntegrationSubscriptionDto } from '../../integration/dto';

@Injectable()
export class UpdateChannelSetForBusinessListener {
  constructor(
    private readonly terminalService: TerminalService,
    private readonly businessService: BusinessService,
  ) { }

  @EventListener({ eventName: InternalEventsEnum.onIntegrationEnabledEvent, priority: 1} )
  public async onIntegrationEnabled(toggleSubDto: ToggleIntegrationSubscriptionDto): Promise<void> {
    if (!OPTIONAL_CHANNEL_TYPES.includes(toggleSubDto.name as ChannelSubTypeEnum)) {
      return;
    }

    const business: BusinessModel = await this.businessService.findOneById(toggleSubDto.businessId) as BusinessModel;
    if (!business) {
      return;
    }

    await this.terminalService.createChannelSetForBusiness(business, toggleSubDto.name as ChannelSubTypeEnum);
  }

  @EventListener({ eventName: InternalEventsEnum.onIntegrationDisabledEvent, priority: 1} )
  public async onIntegrationDisabled(toggleSubDto: ToggleIntegrationSubscriptionDto): Promise<void> {
    if (!OPTIONAL_CHANNEL_TYPES.includes(toggleSubDto.name as ChannelSubTypeEnum)) {
      return;
    }

    const business: BusinessModel = await this.businessService.findOneById(toggleSubDto.businessId) as BusinessModel;
    if (!business) {
      return;
    }

    await this.terminalService.deleteChannelSetFromBusiness(business, toggleSubDto.name as ChannelSubTypeEnum);
  }
}
