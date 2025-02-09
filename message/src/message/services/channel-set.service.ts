import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

import { MessagingIntegrationsEnum } from '@pe/message-kit';
import {
  ChannelService,
  OneToOneChannelSetService,
  ChannelModel,
  ChannelSetModel,
  ChannelEventMessagesProducer,
  ChannelAwareBusinessService,
  ChannelAwareBusinessModel,
} from '@pe/channels-sdk';
import { CHANNEL_SET_SERVICE } from '@pe/channels-sdk/module/constants';

import { ChannelSetCreateDto } from '../dto';
import { AbstractMessagingDocument, AbstractMessaging } from '../submodules/platform';

@Injectable()
export class MessageChannelSetsService {
  constructor(
    private readonly businessService: ChannelAwareBusinessService,
    private readonly channelService: ChannelService,
    @Inject(CHANNEL_SET_SERVICE) private readonly channelSetService: OneToOneChannelSetService,
    private readonly channelEventMessagesProducer: ChannelEventMessagesProducer,
  ) { }

  public async createChannelSet<T extends AbstractMessagingDocument>(
    chat: T,
  ): Promise<void> {
    if (AbstractMessaging.hasIntegration(chat) && AbstractMessaging.hasBusiness(chat)) {
      if (chat.integrationName !== MessagingIntegrationsEnum.Internal) {
        return;
      }

      const channelSetCreateDto: ChannelSetCreateDto = plainToClass(ChannelSetCreateDto, {
        channelName: MessagingIntegrationsEnum.Internal,
        channelType: MessagingIntegrationsEnum.Internal,
      });
      await validate(channelSetCreateDto);

      const channel: ChannelModel = await this.channelService.findOneByType(channelSetCreateDto.channelType);
      if (!channel) {
        throw new NotFoundException('Channel not found. Type ' + channelSetCreateDto.channelType);
      }

      const channelAwareBusiness: ChannelAwareBusinessModel = await this.businessService.findOneById(chat.business);
      if (!channelAwareBusiness) {
        throw new NotFoundException('channelAwareBusiness not found. BusinessId:' + chat.business);
      }

      const channelSets: ChannelSetModel[] = await this.channelSetService.create(channel, channelAwareBusiness);

      if (!channelSets || channelSets.length === 0) {
        throw new NotFoundException(`channelSets not created. channel:${channel._id}, business:${chat.business}`);
      }

      const channelSet: ChannelSetModel = channelSets[0];

      if (channelSetCreateDto.channelName !== '') {
        await this.channelEventMessagesProducer.sendChannelSetNamedByApplication(
          channelSet, channelSetCreateDto.channelName);
      }

      await this.channelEventMessagesProducer.sendChannelSetActivated(
        channelSet, channelAwareBusiness);
    }
  }
}
