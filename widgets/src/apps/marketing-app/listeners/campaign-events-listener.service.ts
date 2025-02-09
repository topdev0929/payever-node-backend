import { Injectable } from '@nestjs/common';
import { BusinessEventsEnum } from '@pe/business-kit';
import { BusinessModel } from '../../../business/models';
import { ChannelSetEventsEnum } from '../../../statistics/enum';
import { ChannelSetModel } from '../../../statistics/models';
import { CampaignAppService } from '../services';
import { EventListener } from '@pe/nest-kit';

@Injectable()
export class CampaignEventsListener {

  constructor(
    private readonly campaignAppService: CampaignAppService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  private async handleBusinessRemoved(business: BusinessModel): Promise<void> {
    await this.campaignAppService.removeAllByBusiness(business);
  }

  @EventListener(ChannelSetEventsEnum.ChannelSetRemoved)
  private async handleChannelSetRemoved(channelSet: ChannelSetModel): Promise<void> {
    await this.campaignAppService.removeAllByChannelSet(channelSet);
  }
}
