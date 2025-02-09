import { Injectable } from '@nestjs/common';
import { ChannelSetEvent, ChannelSetModel } from '@pe/channels-sdk';
import { EventListener } from '@pe/nest-kit';
import { ShopSystemService } from '../services';

@Injectable()
export class ShopSystemEventListener {
  constructor(
    private readonly shopSystemService: ShopSystemService,
  ) { }

  @EventListener(ChannelSetEvent.ChannelSetRemoved)
  public async onChannelSetRemoved(channelSet: ChannelSetModel): Promise<void> {
    await this.shopSystemService.removeAllByChannelSet(channelSet);
  }
}
