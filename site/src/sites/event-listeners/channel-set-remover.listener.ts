import { Inject, Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { CHANNEL_SET_SERVICE, ChannelSetServiceInterface } from '@pe/channels-sdk';
import { SiteDocument } from '../schemas';
import { SiteEventsEnum } from '../enums';

@Injectable()
export class ChannelSetRemoverListener {
  constructor(
    @Inject(CHANNEL_SET_SERVICE) private readonly channelSetsService: ChannelSetServiceInterface,
  ) { }
  

  @EventListener(SiteEventsEnum.SiteRemoved)
  public async onSiteRemoved(site: SiteDocument, deleteTestData: boolean = false): Promise<void> {

    if (site.channelSet && !deleteTestData && site.channelSetDocument) {
      await this.channelSetsService.deleteOneById(site.channelSetDocument._id);
    }
  }
}
