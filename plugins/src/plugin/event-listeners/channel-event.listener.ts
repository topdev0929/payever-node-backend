import { Injectable, Inject } from '@nestjs/common';
import {
  ChannelSetServiceInterface,
  ChannelAwareBusinessModel,
  ChannelEvent,
  ChannelModel,
  ChannelService,
  ChannelSetModel,
  CHANNEL_SET_SERVICE,
} from '@pe/channels-sdk';
import { EventListener } from '@pe/nest-kit';
import { BusinessService } from '@pe/business-kit';

import { BusinessModel } from '../../business/models';

@Injectable()
export class ChannelEventListener {
  constructor(
    private readonly businessService: BusinessService,
    private readonly channelService: ChannelService,
    @Inject(CHANNEL_SET_SERVICE) private readonly channelSetService: ChannelSetServiceInterface,
  ) { }

  @EventListener(ChannelEvent.ChannelEnabled)
  public async onChannelForBusinessEnabled(payload: {
    channel: ChannelModel;
    business: ChannelAwareBusinessModel;
  }): Promise<void> {
    const channel: ChannelModel = await this.channelService.findOneByType(
      payload.channel.type,
    );
    if (!channel) {
      return;
    }

    const business: BusinessModel = await this.businessService.findOneById(
      payload.business._id,
    ) as unknown as BusinessModel;
    if (!business) {
      return;
    }

    await this.channelSetService.create(channel, business);
  }
}
