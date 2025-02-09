import { Injectable } from '@nestjs/common';
import { BusinessEventsEnum } from '@pe/business-kit';
import { BusinessModel } from '../../business/models';
import { ChannelSetService } from '../services';
import { EventListener } from '@pe/nest-kit';

@Injectable()
export class ChannelSetEventsListener {

  constructor(
    private readonly channelSetService: ChannelSetService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  private async handleBusinessRemoved(business: BusinessModel): Promise<void> {
    await this.channelSetService.deleteAllByBusiness(business);
  }
}
