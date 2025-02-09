import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';

import { SiteDocument } from '../schemas';
import { SiteEventsEnum } from '../enums';
import { SiteMessagesProducer } from '../producers';
import { isArray } from 'util';

@Injectable()
export class SiteLiveToggledListener {
  constructor(
    private readonly siteMessagesProducer: SiteMessagesProducer,
  ) { }

  @EventListener(SiteEventsEnum.SiteUpdated)
  public async onSiteUpdated(originalSite: SiteDocument, updatedSite: SiteDocument): Promise<void> {

  const isOriginalSiteLive = originalSite.accessConfigDocument?.length > 0 && 
    originalSite.accessConfigDocument[0]?.isLive;
    
  const isUpdatedSiteLive = updatedSite.accessConfigDocument?.length > 0 && 
    updatedSite.accessConfigDocument[0]?.isLive;

    if (isOriginalSiteLive !== isUpdatedSiteLive) {
      await this.siteMessagesProducer.siteLiveToggled(updatedSite);
    }
  }
}
