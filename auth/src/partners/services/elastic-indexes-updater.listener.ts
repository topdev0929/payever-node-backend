import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';

import { PartnerTagsElastic } from './partner-tags-elastic.service';
import { PartnerTagEventsEnum } from '../enum';
import { PartnerTagInterface } from '../interfaces';

@Injectable()
export class ElasticIndexesUpdaterListener {
  constructor(
    private readonly partnerTagsElasticService: PartnerTagsElastic,
  ) { }

  @EventListener(PartnerTagEventsEnum.added)
  private async onPartnerTagAdded(partnerTag: PartnerTagInterface): Promise<void> {
    await this.partnerTagsElasticService.saveIndex(partnerTag);
  }

  @EventListener(PartnerTagEventsEnum.removed)
  private async onPartnerTagRemoved(partnerTag: PartnerTagInterface): Promise<void> {
    await this.partnerTagsElasticService.removeIndex(partnerTag);
  }
}
