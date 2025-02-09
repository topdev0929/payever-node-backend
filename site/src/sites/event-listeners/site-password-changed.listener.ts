import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';

import { SiteDocument, SiteAccessConfigDocument } from '../schemas';
import { SiteEventsEnum } from '../enums';
import { SiteMessagesProducer } from '../producers';

@Injectable()
export class SitePasswordChangedListener {
  constructor(
    private readonly siteMessagesProducer: SiteMessagesProducer,
  ) { }

  @EventListener(SiteEventsEnum.SiteUpdated)
  public async onSiteUpdated(originalSite: SiteDocument, updatedSite: SiteDocument): Promise<void> {
    if (originalSite.accessConfigDocument?.length > 0 && 
        updatedSite.accessConfigDocument?.length > 0 && 
        this.hasPasswordChanged(originalSite.accessConfigDocument[0], updatedSite.accessConfigDocument[0])
      ) {
      await this.siteMessagesProducer.sitePasswordUpdated(updatedSite);

      if (originalSite.accessConfigDocument[0]?.isPrivate !== updatedSite.accessConfigDocument[0]?.isPrivate) {
        await this.siteMessagesProducer.sitePasswordToggled(updatedSite);
      }
    }
  }

  private hasPasswordChanged(
    originalConfig: SiteAccessConfigDocument,
    updatedConfig: SiteAccessConfigDocument,
  ): boolean {
    return originalConfig?.isPrivate !== updatedConfig?.isPrivate
      || originalConfig?.privatePassword !== updatedConfig?.privatePassword
      || originalConfig?.privateMessage !== updatedConfig?.privateMessage;
  }
}
