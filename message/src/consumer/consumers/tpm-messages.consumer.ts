import { Controller, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { MessagePattern } from '@nestjs/microservices';
import { Subscribe, Payload } from '@pe/stomp-client';

import { ChatMessageService, ChatTextMessage } from '../../message/submodules/platform';
import { EventOriginEnum, RabbitChannelsEnum } from '../../message/enums';
import { StompTopicsEnum } from '../enums';
import { TPMMessageRMQIncomingDto, TPMTextMessageRMQIncomingDto } from '../dto';
import { PinMessageDto } from '../../message/dto';

/**
 * @description RMQ/STOMP combined controller/service
 */
@Injectable()
@Controller()
export class ThirdPartyMessengerMessagesConsumer {
  constructor(
    private readonly chatMessageService: ChatMessageService,
  ) { }

  @Subscribe({
    queue: `/queue/${StompTopicsEnum.TpmMessageCreated}`,
  })
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: StompTopicsEnum.TpmMessageCreated,
  })
  public async onChatMessageCreated(
    @Payload('json') dto: TPMTextMessageRMQIncomingDto,
  ): Promise<void> {
    const messagePrototype: ChatTextMessage = {
      _id: uuid(),
      attachments: [],
      ...dto,
      type: 'text',
    };
    await this.chatMessageService.create([messagePrototype], EventOriginEnum.ThirdParty);
  }

  @Subscribe({
    queue: `/queue/${StompTopicsEnum.TpmMessageUpdated}`,
  })
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: StompTopicsEnum.TpmMessageUpdated,
  })
  public async onChatMessageUpdated(
    @Payload('json') dto: TPMTextMessageRMQIncomingDto,
  ): Promise<void> {
    //  TODO: Allow to update messages from chat contact only. ?
    await this.chatMessageService.update({
      $set: dto,
      _id: dto._id,
    }, EventOriginEnum.ThirdParty);
  }

  @Subscribe({
    queue: `/queue/${StompTopicsEnum.TpmMessageDeleted}`,
  })
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: StompTopicsEnum.TpmMessageDeleted,
  })
  public async onChatMessageDeleted(
    @Payload('json') dto: TPMMessageRMQIncomingDto,
  ): Promise<void> {
    await this.chatMessageService.delete(dto._id, EventOriginEnum.ThirdParty);
  }

  @Subscribe({
    queue: `/queue/${StompTopicsEnum.TpmMessagePin}`,
  })
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: StompTopicsEnum.TpmMessagePin,
  })
  public async onChatMessagePinned(
    @Payload('json') dto: PinMessageDto,
  ): Promise<void> {
    await this.chatMessageService.pinMessage(dto);
  }

  @Subscribe({
    queue: `/queue/${StompTopicsEnum.TpmMessageUnpin}`,
  })
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: StompTopicsEnum.TpmMessageUnpin,
  })
  public async onChatMessageUnpinned(
    @Payload('json') dto: PinMessageDto,
  ): Promise<void> {
    await this.chatMessageService.unpinMessage(dto);
  }

}
