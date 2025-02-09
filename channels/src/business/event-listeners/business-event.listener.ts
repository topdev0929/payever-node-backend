import { Injectable, Inject } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessModel, BusinessEventsEnum } from '@pe/business-kit';
import { CHANNEL_SET_SERVICE, ChannelSetServiceInterface } from '@pe/channels-sdk';

@Injectable()
export class BusinessEventListener {
  constructor(
    @Inject(CHANNEL_SET_SERVICE) private readonly channelSetService: ChannelSetServiceInterface,
  ) { }
  
  @EventListener(BusinessEventsEnum.BusinessCreated)
  public async onBusinessCreated(business: BusinessModel): Promise<void>  {
    await this.channelSetService.updateChannelSetsInBusiness(business._id);
  }
}
