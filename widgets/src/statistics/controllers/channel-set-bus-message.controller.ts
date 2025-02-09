import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BusinessService } from '@pe/business-kit';

import { BusinessModel } from '../../business/models';
import { ChannelNamedDto, ChannelSetCreatedDto, ChannelSetActiveDto } from '../dto';
import { ChannelSetModel } from '../models';
import { ChannelSetService } from '../services';

@Controller()
export class ChannelSetBusMessageController {
  constructor(
    private readonly logger: Logger,
    private readonly businessService: BusinessService,
    private readonly channelSetService: ChannelSetService,
  ) { }

  @MessagePattern({
      name: 'channels.event.channel-set.created',
  })
  public async onChannelSetCreateEvent(createChannelSetDto: ChannelSetCreatedDto): Promise<void> {
    const business: BusinessModel = await this.businessService
    .findOneById(createChannelSetDto.business.id) as unknown as BusinessModel;
    if (!business) {
      return;
    }

    await this.channelSetService.create(createChannelSetDto.id, {
      business: business,
      currency: business.currency,
      type: createChannelSetDto.channel.type,
    });
  }

  @MessagePattern({
      name: 'channels.event.channel-set.named',
  })
  public async onChannelNamedEvent(channelNamedDto: ChannelNamedDto): Promise<void> {

    const channelSet: ChannelSetModel = await this.channelSetService.findOneById(channelNamedDto.id);
    if (!channelSet) {
      return;
    }

    await this.channelSetService.update(channelNamedDto.id, { name: channelNamedDto.name });
  }

  @MessagePattern({
    name: 'monolith.channel-set.migrate',
  })
  public async onChannelSetMigrateEvent(data: any): Promise<void> {
    const business: BusinessModel = await this.businessService
    .findOneById(data.business_uuid) as unknown as BusinessModel;

    if (!business) {
      return;
    }

    const channelSet: ChannelSetModel = await this.channelSetService.findOneById(data.uuid);
    if (channelSet) {
      return;
    }

    await this.channelSetService.create(data.uuid, {
      business: business,
      currency: business.currency,
      type: data.channel_type,
    });
  }

  @MessagePattern({
    name: 'shop.event.shop-active.updated',
  })
  public async setShopActiveChannelSet(data: ChannelSetActiveDto): Promise<void> {
    const business: BusinessModel = await this.businessService
    .findOneById(data.businessId) as unknown as BusinessModel;
    if (!business) {
      return;
    }
    await this.channelSetService.changeActiveChannelSet(business, data.channelSetId, 'shop');
  }
}
