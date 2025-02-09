import { v4 as uuid } from 'uuid';
import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BasicListener } from './basic.listener';
import { EventOriginEnum } from '../../enums';
import { ProducerInterface } from '../../producers';
import { ChatCreatedExtraDataInterface } from '../../interfaces';
import { AbstractMessagingDocument, ChatMember, ChatBoxMessage, Pinned } from '../../submodules/platform';
import { GroupChat } from '../../submodules/messaging/group-chats';
import { CommonChannel } from '../../submodules/messaging/common-channels';
import { UserDocument } from '../../../projections/models';
import { InternalEventCodesEnum } from '../../../common';
import { MessageHttpResponseDto } from '../../dto';
import { ChatOnlineMemberInterface } from '../../schemas';

@Injectable()
export class ChatListener extends BasicListener {
  @EventListener(InternalEventCodesEnum.ChatCreated)
  public async onChatCreated(
    chat: AbstractMessagingDocument,
    eventSource: EventOriginEnum,
    data: ChatCreatedExtraDataInterface<AbstractMessagingDocument>,
  ): Promise<void> {
    if (
      (
        CommonChannel.isTypeOf(chat)
      )
      ||
      GroupChat.isTypeOf(chat)
    ) {
      await this.chatInviteService.create({ chat: chat._id });
      if (chat.business) {
        await this.channelSetService.createChannelSet(chat);
      }
    }
    await this.invokeProducers(
      eventSource,
      (producer: ProducerInterface) => producer.chatCreated(chat, data),
    );
  }

  @EventListener(InternalEventCodesEnum.ChatUpdated)
  public async onChatUpdated(
    chat: AbstractMessagingDocument,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    await this.invokeProducers(
      eventSource,
      (producer: ProducerInterface) => producer.chatUpdated(chat),
    );
  }

  @EventListener(InternalEventCodesEnum.ChatDeleted)
  public async onChatDeleted(
    chat: AbstractMessagingDocument,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    await this.invokeProducers(
      eventSource,
      (producer: ProducerInterface) => producer.chatDeleted(chat),
    );
  }

  @EventListener(InternalEventCodesEnum.MemberIncluded)
  public async onMemberIncluded(
    chat: AbstractMessagingDocument,
    includedUser: UserDocument,
    includedMember: ChatMember,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    await this.invokeProducers(
      eventSource,
      (producer: ProducerInterface) => producer.memberIncluded(chat, includedUser, includedMember),
    );
  }

  @EventListener(InternalEventCodesEnum.MemberExcluded)
  public async onMemberExcluded(
    chat: AbstractMessagingDocument,
    excludedUser: UserDocument | null,
    excludedMember: ChatMember,
    eventSource: EventOriginEnum,
): Promise<void> {
    await this.invokeProducers(
      eventSource,
      (producer: ProducerInterface) => producer.memberExcluded(chat, excludedUser, excludedMember),
    );
  }

  @EventListener(InternalEventCodesEnum.MemberLeft)
  public async onMemberLeft(
    chat: AbstractMessagingDocument,
    leftUser: UserDocument | null,
    leftMember: ChatMember,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    await this.invokeProducers(
      eventSource,
      (producer: ProducerInterface) => producer.memberLeft(chat, leftUser, leftMember),
    );
  }

  @EventListener(InternalEventCodesEnum.MemberChanged)
  public async onMemberChanged(
    chat: AbstractMessagingDocument,
    user: UserDocument,
    changedMember: ChatMember,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    await this.invokeProducers(
      eventSource,
      (producer: ProducerInterface) => producer.memberChanged(chat, user, changedMember),
    );
  }

  @EventListener(InternalEventCodesEnum.MessagePinned)
  public async onMessagePinned(
    chat: AbstractMessagingDocument,
    pinned: Pinned,
    eventSource: EventOriginEnum,
    message: MessageHttpResponseDto,
  ): Promise<void> {
    await this.invokeProducers(
      eventSource,
      (producer: ProducerInterface) => producer.chatMessagePinned(chat, pinned, message),
    );
  }

  @EventListener(InternalEventCodesEnum.MessageUnpinned)
  public async onMessageUnpinned(
    chat: AbstractMessagingDocument,
    unpinned: Pinned,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    await this.invokeProducers(
      eventSource,
      (producer: ProducerInterface) => producer.chatMessageUnpinned(chat, unpinned),
    );
  }

  @EventListener(InternalEventCodesEnum.ChatTyping)
  public async onChatTypingUpdated(
    chat: AbstractMessagingDocument,
    member: ChatOnlineMemberInterface,
    isTyping: boolean,
    typingMembers: ChatOnlineMemberInterface[],
    eventSource: EventOriginEnum,
  ): Promise<void> {
    await this.invokeProducers(
      eventSource,
      (producer: ProducerInterface) => producer.typingUpdated(
        chat,
        member,
        isTyping,
        typingMembers,
      ),
    );
  }

  @EventListener(InternalEventCodesEnum.ChatOnlineMembersUpdated)
  public async onOnlineMembersUpdated(
    chat: AbstractMessagingDocument,
    onlineMembers: ChatOnlineMemberInterface[],
    onlineMembersCount: number,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    await this.invokeProducers(
      eventSource,
      (producer: ProducerInterface) => producer.onlineMembersUpdated(
        chat,
        onlineMembers,
        onlineMembersCount,
      ),
    );
  }
}
