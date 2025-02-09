import {
  AbstractMessagingDocument,
  AbstractChatMessageDocument,
  ChatMember,
  Pinned,
} from '../schemas';
import { UserDocument } from '../../../../projections/models';
import { EventOriginEnum } from '../../../enums';
import { ChatCreatedExtraDataInterface } from '../../../interfaces';
import { ContactDocument } from '../model';
import { MessageHttpResponseDto } from '../../../dto';
import { ChatOnlineMemberInterface } from '../../../schemas';

export interface ChatMessageProducerInterface {
  messagesUpdated(
    messages: AbstractChatMessageDocument[],
    chat: AbstractMessagingDocument,
  ): Promise<void>;
  messagesUpdatedWithList(
    messages: AbstractChatMessageDocument[],
    chat: AbstractMessagingDocument,
  ): Promise<void>;
  messagesDeleted(
    messages: AbstractChatMessageDocument[],
    chat: AbstractMessagingDocument,
  ): Promise<void>;
  messagesListDeleted(
    messages: AbstractChatMessageDocument[],
    chat: AbstractMessagingDocument,
  ): Promise<void>;
  messagesPosted(
    messages: AbstractChatMessageDocument[],
    chat: AbstractMessagingDocument,
  ): Promise<void>;
}

export interface ChatProducerInterface {
  chatCreated(
    chat: AbstractMessagingDocument,
    data: ChatCreatedExtraDataInterface<AbstractMessagingDocument>,
  ): Promise<void>;
  chatUpdated(chat: AbstractMessagingDocument): Promise<void>;
  chatDeleted(chat: AbstractMessagingDocument): Promise<void>;
}

export interface PinnedProducerInterface {
  chatMessagePinned(chat: AbstractMessagingDocument, pinned: Pinned, message: MessageHttpResponseDto): Promise<void>;
  chatMessageUnpinned(chat: AbstractMessagingDocument, pined: Pinned): Promise<void>;
}

export interface ChatMembersProducerInterface {
  memberIncluded(chat: AbstractMessagingDocument, user: UserDocument, member: ChatMember): Promise<void>;
  memberChanged(chat: AbstractMessagingDocument, user: UserDocument, member: ChatMember): Promise<void>;
  memberExcluded(chat: AbstractMessagingDocument, user: UserDocument | null, member: ChatMember): Promise<void>;
  memberLeft(chat: AbstractMessagingDocument, user: UserDocument | null, member: ChatMember): Promise<void>;
}

export interface ContactsProducerInterface {
  contactCreated(contact: ContactDocument): Promise<void>;
  contactUpdated(contact: ContactDocument): Promise<void>;
  contactStatus(contact: ContactDocument): Promise<void>;
}

export interface TypingProducerInterface {
  typingUpdated(
    chat: AbstractMessagingDocument,
    member: ChatOnlineMemberInterface,
    isTyping: boolean,
    typingMembers: ChatOnlineMemberInterface[],
  ): Promise<void>;
}

export interface OnlineProducerInterface {
  onlineMembersUpdated(
    chat: AbstractMessagingDocument,
    onlineMembers: ChatOnlineMemberInterface[],
    onlineMembersCount: number,
  ): Promise<void>;
}

export interface ProducerBaseInterface {
  canProduce(eventSource: EventOriginEnum): boolean;
}

export type ProducerInterface =
  ProducerBaseInterface &
  ChatMessageProducerInterface &
  ChatProducerInterface &
  PinnedProducerInterface &
  ChatMembersProducerInterface &
  ContactsProducerInterface &
  TypingProducerInterface &
  OnlineProducerInterface;
