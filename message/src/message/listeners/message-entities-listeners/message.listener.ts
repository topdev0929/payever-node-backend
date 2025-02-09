// tslint:disable: no-identical-functions
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { EventOriginEnum } from '../../enums';
import {
  AbstractMessagingDocument,
  AbstractChatMessageDocument,
} from '../../submodules/platform';
import { InternalEventCodesEnum } from '../../../common';
import {
  ChatMessageProducerInterface, ProducerInterface,
} from '../../producers';
import { BasicListener } from './basic.listener';

@Injectable()
export class MessageListener extends BasicListener {
  @EventListener(InternalEventCodesEnum.MessagesCreated)
  public async onNewMessagesCreated(
    messages: AbstractChatMessageDocument[],
    eventSource: EventOriginEnum,
  ): Promise<void> {    
    await this.produceMessageChangesEvent(
      'messagesPosted',
      messages,
      eventSource,
    );
  }

  @EventListener(InternalEventCodesEnum.MessageDeleted)
  public async onMessagesDeleted(
    messages: AbstractChatMessageDocument[],
    eventSource: EventOriginEnum,
  ): Promise<void> {
    await this.produceMessageChangesEvent(
      'messagesDeleted',
      messages,
      eventSource,
    );
  }

  @EventListener(InternalEventCodesEnum.MessageListDeleted)
  public async onMessagesArrayDeleted(
    messages: AbstractChatMessageDocument[],
    eventSource: EventOriginEnum,
  ): Promise<void> {
    await this.produceMessageChangesEvent(
      'messagesListDeleted',
      messages,
      eventSource,
    );
  }

  @EventListener(InternalEventCodesEnum.ChatHardDeleted)
  public async onMessagingHardDeleted(
    messaging: AbstractMessagingDocument,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    await this.chatMessageService.hardDeleteAllByMessagingId(messaging._id);
  }

  @EventListener(InternalEventCodesEnum.MessageUpdated)
  public async onMessagesUpdated(
    messages: AbstractChatMessageDocument[],
    eventSource: EventOriginEnum,
  ): Promise<void> {
    await this.produceMessageChangesEvent(
      'messagesUpdated',
      messages,
      eventSource,
    );
  }

  @EventListener(InternalEventCodesEnum.MessageListUpdated)
  public async onMessagesListUpdated(
    message: AbstractChatMessageDocument[],
    eventSource: EventOriginEnum,
  ): Promise<void> {
    await this.produceMessageChangesEvent(
      'messagesUpdatedWithList',
      message,
      eventSource,
    );
  }

  private async produceMessageChangesEvent(
    method: keyof ChatMessageProducerInterface,
    messages: AbstractChatMessageDocument[],
    eventSource: EventOriginEnum,
  ): Promise<void> {
    if (!messages.length) {
      throw new InternalServerErrorException(`No messages to process event`);
    }
    const message: AbstractChatMessageDocument = messages[0];
    const chat: AbstractMessagingDocument = await this.commonMessagingService.findById(message.chat);
    if (!chat) {
      throw new NotFoundException(`Chat with _id "${message.chat}" not found`);
    }    

    return this.invokeProducers(
      eventSource,
      (producer: ProducerInterface) => producer[method](messages, chat),
    );
  }
}
