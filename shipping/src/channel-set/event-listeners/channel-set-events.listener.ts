import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessEventsEnum } from '@pe/business-kit';
import { BusinessModel } from '../../business/models';
import { ChannelSetService } from '../services';

@Injectable()
export class ChannelSetEventsListener {
  constructor(
    private readonly channelSetService: ChannelSetService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  public async handleBusinessRemoved(business: BusinessModel): Promise<void> {
    await this.channelSetService.deleteAllByBusiness(business);
  }
}
