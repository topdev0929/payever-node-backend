import { Injectable } from '@nestjs/common';
import { StompService } from '@pe/stomp-client';
import { ProducerInterface } from '../submodules/platform/interfaces/producer.interface';
import { StompTopicsEnum } from '../../consumer/enums';
import { EventOriginEnum } from '../enums';
import {
  AbstractMessagingDocument,
  ContactDocument,
  AbstractChatMessageDocument,
  AbstractMessaging,
  MessagingProducer,
  Pinned,
} from '../submodules/platform';
import { ThirdPartyChatMessageOutgoingDto } from '../dto';
import { ChatOnlineMemberInterface } from '../schemas';
import { MessagingIntegrationsEnum } from '@pe/message-kit';
import { MessageUserActivityDto } from '@pe/message-kit/modules/connect-app-sdk';

@MessagingProducer()
@Injectable()
export class ThirdPartyMessengerProducer implements ProducerInterface {
  constructor(
    private readonly stompService: StompService,
  ) { }

  public canProduce(eventSource: EventOriginEnum): boolean {
    return eventSource !== EventOriginEnum.ThirdParty;
  }

  public async contactCreated(contact: ContactDocument): Promise<void> {
    this.stompService.publishJson(StompTopicsEnum.MessageContactCreated, contact);
  }

  public async contactUpdated(contact: ContactDocument): Promise<void> {
    this.stompService.publishJson(StompTopicsEnum.MessageContactUpdated, contact);
  }

  public async contactStatus(): Promise<void> { }

  public async memberIncluded(): Promise<void> { }

  public async memberChanged(): Promise<void> { }

  public async memberExcluded(): Promise<void> { }

  public async memberLeft(): Promise<void> { }

  public async chatCreated(chat: AbstractMessagingDocument): Promise<void> {
    this.stompService.publishJson(StompTopicsEnum.MessageChatCreated, chat);
  }

  public async chatUpdated(chat: AbstractMessagingDocument): Promise<void> {
    this.stompService.publishJson(StompTopicsEnum.MessageChatUpdated, chat);
  }

  public async chatDeleted(chat: AbstractMessagingDocument): Promise<void> {
    this.stompService.publishJson(StompTopicsEnum.MessageChatDeleted, chat);
  }

  public async chatMessagePinned(chat: AbstractMessagingDocument, pinned: Pinned): Promise<void> { }

  public async chatMessageUnpinned(chat: AbstractMessagingDocument, pined: Pinned): Promise<void> { }

  public async messagesUpdated(
    messages: AbstractChatMessageDocument[],
    chat: AbstractMessagingDocument & { integrationName: string },
  ): Promise<void> {

    if (AbstractMessaging.hasIntegration(chat) && AbstractMessaging.hasBusiness(chat)) {
      for (const message of messages) {
        const dtoToSend: ThirdPartyChatMessageOutgoingDto = {
          ...(message.toObject ? message.toObject() : message),
          businessId: chat.business,
          integrationName: chat.integrationName,
          type: 'text',
        };
        this.stompService.publishJson(StompTopicsEnum.MessageMessageUpdated, dtoToSend);
      }
    }
  }

  public async messagesUpdatedWithList(
    messages: AbstractChatMessageDocument[],
    chat: AbstractMessagingDocument & { integrationName: string },
  ): Promise<void> {

    if (AbstractMessaging.hasIntegration(chat) && AbstractMessaging.hasBusiness(chat)) {
      const dtoToSends: ThirdPartyChatMessageOutgoingDto[] = messages.map((message: AbstractChatMessageDocument) => {
        
        return {
          ...(message.toObject ? message.toObject() : message),
          businessId: chat.business,
          integrationName: chat.integrationName,
          type: 'text',
        };
      });
      this.stompService.publishJson(StompTopicsEnum.MessageMessageListDeleted, dtoToSends);
    }
  }

  public async messagesDeleted(
    messages: AbstractChatMessageDocument[],
    chat: AbstractMessagingDocument & { integrationName: string },
  ): Promise<void> {

    if (AbstractMessaging.hasIntegration(chat) && AbstractMessaging.hasBusiness(chat)) {
      for (const message of messages) {
        const dtoToSend: ThirdPartyChatMessageOutgoingDto = {
          ...(message.toObject ? message.toObject() : message),
          businessId: chat.business,
          integrationName: chat.integrationName,
          type: 'text',
        };
        this.stompService.publishJson(StompTopicsEnum.MessageMessageDeleted, dtoToSend);
      }
    }
  }

  public async messagesListDeleted(
    messages: AbstractChatMessageDocument[],
    chat: AbstractMessagingDocument & { integrationName: string },
  ): Promise<void> {

    if (AbstractMessaging.hasIntegration(chat) && AbstractMessaging.hasBusiness(chat)) {
      const dtoToSend: ThirdPartyChatMessageOutgoingDto[] = messages.map(
        (message: AbstractChatMessageDocument) => {
          return {
            ...(message.toObject ? message.toObject() : message),
            businessId: chat.business,
            integrationName: chat.integrationName,
            type: 'text',
          };
        },
      );
      this.stompService.publishJson(StompTopicsEnum.MessageMessageListDeleted, dtoToSend);
    }
  }

  public async messagesPosted(
    messages: AbstractChatMessageDocument[],
    chat: AbstractMessagingDocument & { integrationName: string },
  ): Promise<void> {
    if (AbstractMessaging.hasIntegration(chat) && AbstractMessaging.hasBusiness(chat)) {
      for (const message of messages) {
        const dtoToSend: ThirdPartyChatMessageOutgoingDto = {
          ...(message.toObject ? message.toObject() : message),
          businessId: chat.business,
          integrationName: chat.integrationName,
        };
        this.stompService.publishJson(StompTopicsEnum.MessageMessageCreated, dtoToSend);
      }
    }
  }

  public async typingUpdated(
    chat: AbstractMessagingDocument & { integrationName: MessagingIntegrationsEnum; business: string },
    member: ChatOnlineMemberInterface,
    isTyping: boolean,
    typingMembers: ChatOnlineMemberInterface[],
  ): Promise<void> {

    if (!chat.integrationName) {
      return;
    }

    const dtoToSend: MessageUserActivityDto = {
      businessId: chat.business,
      chatId: chat._id,
      connectionId: member.contactId,
      contactId: member.contactId,
      integrationName: chat.integrationName,
      onlineActivity: null,
      typingActivity: {
        isTyping,
        typingMembers,
      },
    };
    this.stompService.publishJson(StompTopicsEnum.MessageUserActivity, dtoToSend);
    const guestContacts: string[] = chat.members.filter((a) => a.guestUser).map((a) => a.guestUser.contactId);
    this.stompService.publishJson(StompTopicsEnum.MessageUserActivityForLiveChat, {
      _id: chat._id,
      guests: guestContacts,
      isTyping,
      member,
      typingMembers,
    });
  }

  public async onlineMembersUpdated(): Promise<void> { }
}
