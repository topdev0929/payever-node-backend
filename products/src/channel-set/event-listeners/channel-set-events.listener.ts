import { Injectable } from '@nestjs/common';

import { EventListener } from '@pe/nest-kit';
import { BusinessDto, BusinessEventsEnums, BusinessModel, BusinessService } from '../../business';
import { ChannelSetService } from '../services';
import { ChannelTypeEnum } from '../enums';
import { ChannelSetModel } from '../models';

@Injectable()
export class ChannelSetEventsListener {
  constructor(
    private readonly businessService: BusinessService,
    private readonly channelSetService: ChannelSetService,
  ) { }

  @EventListener(BusinessEventsEnums.BusinessCreated)
  public async onBusinessCreated(businessDto: BusinessDto): Promise<void> {
    await this.createChannelSetsIfNotExist(businessDto);
  }

  @EventListener(BusinessEventsEnums.BusinessUpdated)
  public async onBusinessUpdated(businessDto: BusinessDto): Promise<void> {
    await this.createChannelSetsIfNotExist(businessDto);
  }

  @EventListener(BusinessEventsEnums.BusinessRemoved)
  public async handleBusinessRemoved(business: BusinessModel): Promise<void> {
    await this.channelSetService.deleteByBusiness(business);
  }

  private async createChannelSetsIfNotExist(businessDto: BusinessDto): Promise<void> {
    const business: BusinessModel = await this.businessService.getById(businessDto._id);

    const channelSet: ChannelSetModel[] =
      await this.channelSetService.findByTypeAndBusiness(ChannelTypeEnum.Dropshipping, business);

    if (!channelSet || channelSet.length < 1) {
      await this.channelSetService.create({
        active: true,
        businessId: business._id,
        customPolicy: false,
        enabledByDefault: false,
        policyEnabled: true,
        type: ChannelTypeEnum.Dropshipping,
      });
    }
  }
}
