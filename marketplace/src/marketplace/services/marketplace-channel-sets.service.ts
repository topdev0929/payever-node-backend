import { Injectable, Inject } from '@nestjs/common';
import { ChannelModel, ChannelService, ChannelSetModel, OneToOneChannelSetService } from '@pe/channels-sdk';
import { CHANNEL_SET_SERVICE } from '@pe/channels-sdk/module/constants';

import { BusinessModel } from '../interfaces/entities';
import { ChannelsEnum } from '../enums';

@Injectable()
export class MarketplaceChannelSetsService {
  constructor(
    private readonly channelService: ChannelService,
    @Inject(CHANNEL_SET_SERVICE) private readonly channelSetService: OneToOneChannelSetService,
  ) { }

  public async findOrCreate(business: BusinessModel): Promise<ChannelSetModel>  {
    const channel: ChannelModel = await this.channelService.findOneByType(ChannelsEnum.Marketplace);

    if (!channel) {
      throw new Error(`Can't find channel with type "${ChannelsEnum.Marketplace}"`);
    }

    const existing: ChannelSetModel[] = await this.channelSetService.findAllByChannelAndBusiness(channel, business);
    if (existing.length > 0) {
      return existing[0];
    }

    return this.channelSetService.create(channel, business);
  }
}
