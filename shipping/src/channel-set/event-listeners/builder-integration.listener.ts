import { IntegrationEventEnum, RateResponseInterface } from '../../integration';
import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { ChannelSetService } from '../services';
import { ChannelSetModel } from '../models';

@Injectable()
export class BuilderIntegrationListener {
  constructor(
    private readonly channelSetService: ChannelSetService,
  ) { }

  @EventListener(IntegrationEventEnum.getShippingMethod)
  public async handleBusinessRemoved(dto: any):  Promise<RateResponseInterface> {
    const channelSet: ChannelSetModel = await this.channelSetService.findOneById(dto.contextId);

    return this.channelSetService.getMethods(
        channelSet,
        dto.data.shippingAddress,
        dto.data.shippingItems,
    );
  }
}
