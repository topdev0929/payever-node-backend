import { Injectable } from '@nestjs/common';
import { ProducerInterface } from '../submodules/platform/interfaces/producer.interface';
import { v4 as uuid } from 'uuid';
import {
  AbstractMessagingDocument,
  MessagingProducer,
  Pinned,
  ChatMessageService,
  ChatMember,
} from '../submodules/platform';
import { ChatEventMessageDocument } from '../submodules/platform/schemas/message/event';
import { ChatMessageStatusEnum } from '@pe/message-kit';
import { EventMessageTypeEnum, EventOriginEnum } from '../enums';
import { UserDocument } from '../../projections';


@MessagingProducer()
@Injectable()
export class EventMessageProducer implements ProducerInterface {
  constructor(
    private readonly chatMessageService: ChatMessageService,
  ) { }

  public canProduce(): boolean {
    return true;
  }

  public async messagesUpdatedWithList(): Promise<void> { }

  public async contactCreated(): Promise<void> { }

  public async contactUpdated(): Promise<void> { }

  public async contactStatus(): Promise<void> { }

  public async memberIncluded(
    chat: AbstractMessagingDocument,
    user: UserDocument,
    member: ChatMember,
  ): Promise<void> {
    const messagePrototype: ChatEventMessageDocument = {
      _id: uuid(),
      chat: chat._id,
      createdAt: null,
      data: {
        includedById: member.addedBy,
        includedUserId: user?._id,
        withInvitationLink: member.addedByInvitationLink,
      },
      editedAt: null,
      eventName: EventMessageTypeEnum.IncludeMember,
      sender: member.addedBy,
      sentAt: new Date(),
      status: ChatMessageStatusEnum.SENT,
      type: 'event',
      updatedAt: null,
    } as any;

    await this.chatMessageService.create([messagePrototype], EventOriginEnum.MerchantChatServer);
  }

  public async memberChanged(): Promise<void> { }

  public async memberExcluded(
    chat: AbstractMessagingDocument,
    user: UserDocument,
    member: ChatMember,
  ): Promise<void> {
    const messagePrototype: ChatEventMessageDocument = {
      _id: uuid(),
      chat: chat._id,
      createdAt: null,
      data: {
        excludedById: member.removedBy,
        excludedUserId: user._id,
      },
      editedAt: null,
      eventName: EventMessageTypeEnum.ExcludeMember,
      sender: member.removedBy,
      sentAt: new Date(),
      status: ChatMessageStatusEnum.SENT,
      type: 'event',
      updatedAt: null,
    } as any;

    await this.chatMessageService.create([messagePrototype], EventOriginEnum.MerchantChatServer);
  }

  public async memberLeft(
    chat: AbstractMessagingDocument,
    user: UserDocument,
    member: ChatMember,
  ): Promise<void> {
    const messagePrototype: ChatEventMessageDocument = {
      _id: uuid(),
      chat: chat._id,
      createdAt: null,
      data: {
        leftUserId: user._id,
      },
      editedAt: null,
      eventName: EventMessageTypeEnum.LeaveChat,
      sender: user._id,
      sentAt: new Date(),
      status: ChatMessageStatusEnum.SENT,
      type: 'event',
      updatedAt: null,
    } as any;

    await this.chatMessageService.create([messagePrototype], EventOriginEnum.MerchantChatServer);
  }

  public async chatCreated(): Promise<void> { }

  public async chatUpdated(): Promise<void> { }

  public async chatDeleted(): Promise<void> { }

  public async chatMessagePinned(chat: AbstractMessagingDocument, pinned: Pinned): Promise<void> {
    if (!pinned.notifyAllMembers) {
      return;
    }
    const messagePrototype: ChatEventMessageDocument = {
      _id: uuid(),
      chat: chat._id,
      createdAt: null,
      data: {
        forAllUsers: String(pinned.forAllUsers),
        messageId: pinned.messageId,
        pinId: pinned._id,
        pinner: pinned.pinner,
      },
      editedAt: null,
      eventName: EventMessageTypeEnum.PinMessage,
      sender: pinned.pinner,
      sentAt: new Date(),
      status: ChatMessageStatusEnum.SENT,
      type: 'event',
      updatedAt: null,
    } as any;

    await this.chatMessageService.create([messagePrototype], EventOriginEnum.MerchantChatServer);
  }

  public async chatMessageUnpinned(chat: AbstractMessagingDocument, pined: Pinned): Promise<void> { }

  public async messagesUpdated(): Promise<void> { }

  public async messagesDeleted(): Promise<void> { }

  public async messagesListDeleted(): Promise<void> { }

  public async messagesPosted(): Promise<void> { }

  public async typingUpdated(): Promise<void> { }

  public async onlineMembersUpdated(): Promise<void> { }
}
