import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { ChannelSetEventsEnum } from '../../../statistics';
import { ChannelSetModel } from '../../../statistics/models';
import { ChannelSetProductsService } from '../services';

@Injectable()
export class ChannelSetProductsEmitterConsumer {

  constructor(
    private readonly channelSetProductsService: ChannelSetProductsService,
  ) { }

  @EventListener(ChannelSetEventsEnum.ChannelSetRemoved)
  private async handleChannelSetRemoved(channelSet: ChannelSetModel): Promise<void> {
    await this.channelSetProductsService.deleteLastSoldProductsList(channelSet);
    await this.channelSetProductsService.deleteProductsAggregate(channelSet);
  }

}
