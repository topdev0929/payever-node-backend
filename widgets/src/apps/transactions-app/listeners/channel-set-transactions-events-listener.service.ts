import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { ChannelSetEventsEnum } from '../../../statistics/enum';
import { ChannelSetModel } from '../../../statistics/models';
import { ChannelSetTransactionsService } from '../services';

@Injectable()
export class ChannelSetTransactionsEventsListener {

  constructor(
    private readonly channelSetTransactionsService: ChannelSetTransactionsService,
  ) { }

  @EventListener(ChannelSetEventsEnum.ChannelSetRemoved)
  private async handleBusinessRemoved(channelSet: ChannelSetModel): Promise<void> {
    await this.channelSetTransactionsService.deleteDailyAmount(channelSet);
    await this.channelSetTransactionsService.deleteMonthlyAmount(channelSet);
  }
}
