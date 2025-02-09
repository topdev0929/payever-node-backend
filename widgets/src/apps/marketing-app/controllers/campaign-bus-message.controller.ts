import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BusinessService } from '@pe/business-kit';

import { CampaignAppService } from '../services';
import { CampaignCreateDto } from '../dto';
import { BusinessModel } from '../../../business';

@Controller()
export class CampaignBusMessageController {
  constructor(
    private readonly logger: Logger,
    private readonly businessService: BusinessService,
    private readonly campaignAppService: CampaignAppService,
  ) { }

  @MessagePattern({
    name: 'marketing.event.campaign-creation.done',
  })
  public async onCampaignCreatedEvent(data: CampaignCreateDto): Promise<void> {
    const business: BusinessModel = await this.businessService.findOneById(data.business) as  unknown as BusinessModel;

    if (!business) {
      return;
    }

    data._id = data.id;

    await this.campaignAppService.create(data);
  }
}
