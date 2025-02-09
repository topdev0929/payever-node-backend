import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';

import { BusinessEmitterEvent } from '../../business/enums';
import { BusinessModel } from '../../business/models';
import { CampaignService } from '../services';

@Injectable()
export class CampaignEmitterConsumer {

  constructor(
    private readonly campaignService: CampaignService,
  ) { }

  @EventListener(BusinessEmitterEvent.BusinessRemoved)
  public async onBusinessRemoved(business: BusinessModel): Promise<void> {
    await this.campaignService.deleteAllByBusiness(business);
  }
}
