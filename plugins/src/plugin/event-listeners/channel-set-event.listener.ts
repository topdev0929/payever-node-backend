import { Injectable } from '@nestjs/common';
import {
  ChannelAwareBusinessModel,
  ChannelModel,
  ChannelSetEvent,
  ChannelSetModel,
} from '@pe/channels-sdk';
import { EventListener } from '@pe/nest-kit';
import { BusinessService } from '@pe/business-kit';
import { BusinessModel } from '../../business/models';
import { ShopSystemService } from '../services';

@Injectable()
export class ChannelSetEventListener {
  constructor(
    private readonly businessService: BusinessService,
    private readonly shopSystemService: ShopSystemService,
  ) { }

  @EventListener(ChannelSetEvent.ChannelSetCreated)
  public async onChannelSetCreated(
    business: ChannelAwareBusinessModel,
    channel: ChannelModel,
    channelSet: ChannelSetModel,
  ): Promise<void> {
    const businessModel: BusinessModel = await this.businessService.findOneById(
      business._id,
    ) as unknown as BusinessModel;
    if (!business) {
      return;
    }

    await this.shopSystemService.create(channelSet, channel, businessModel);
  }
}
