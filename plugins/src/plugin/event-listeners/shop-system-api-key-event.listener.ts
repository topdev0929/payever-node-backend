import { Injectable } from '@nestjs/common';
import { ChannelAwareBusinessModel, ChannelEvent, ChannelModel, ChannelService } from '@pe/channels-sdk';
import { EventListener } from '@pe/nest-kit';
import { BusinessService } from '@pe/business-kit';

import { BusinessModel } from '../../business/models';
import { ShopSystemModel } from '../models';
import { ShopSystemApiKeyService, ShopSystemService } from '../services';

@Injectable()
export class ShopSystemApiKeyEventListener {
  constructor(
    private readonly shopSystemService: ShopSystemService,
    private readonly businessService: BusinessService,
    private readonly channelService: ChannelService,
    private readonly apiKeyService: ShopSystemApiKeyService,
  ) { }

  @EventListener(ChannelEvent.ChannelDisabled)
  public async onChannelForBusinessDisabled(
    payload: { channel: ChannelModel; business: ChannelAwareBusinessModel },
  ): Promise<void> {
    const channel: ChannelModel = await this.channelService.findOneByType(payload.channel.type);
    if (!channel) {
      return;
    }

    const business: BusinessModel = await this.businessService
    .findOneById(payload.business._id) as unknown as BusinessModel;
    
    if (!business) {
      return;
    }

    const shopSystem: ShopSystemModel = await this.shopSystemService.findOneByChannelAndBusiness(channel, business);
    if (!shopSystem) {
      return;
    }

    await this.apiKeyService.deleteAllByShopSystem(shopSystem);
  }
}
