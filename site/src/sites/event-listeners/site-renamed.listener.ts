import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';

import {
  ChannelEventMessagesProducer,
} from '@pe/channels-sdk';
import { SiteDocument } from '../schemas';
import { SiteEventsEnum } from '../enums';

@Injectable()
export class SiteRenamedListener {
  constructor(private readonly channelMessagesProducer: ChannelEventMessagesProducer,
  ) { }

  @EventListener(SiteEventsEnum.SiteUpdated)
  public async onSiteUpdated(originalSite: SiteDocument, updatedSite: SiteDocument): Promise<void> {
    if (originalSite.name !== updatedSite.name) {
      await this.channelMessagesProducer.sendChannelSetNamedByApplication(
        updatedSite.channelSetDocument,
        updatedSite.name,
      );
    }
  }
}
