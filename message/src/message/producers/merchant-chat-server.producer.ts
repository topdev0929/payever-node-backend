import { Injectable } from '@nestjs/common';
import { ChatMemberStatusEnum, MessagingIntegrationsEnum } from '@pe/message-kit';
import { WsOutgoingMessageEventCodeEnum } from '../../ws/enums';
import { ProducerInterface } from '../submodules/platform/interfaces/producer.interface';
import { UserDocument } from '../../projections/models';
import {
  AbstractMessagingDocument,
  ContactDocument,
  AbstractChatMessage,
  AbstractChatMessageDocument,
  CommonMessagingService,
  AbstractMessaging,
  ChatMember,
  MessagingProducer,
  Pinned,
} from '../submodules/platform';
import { AppChannelDocument } from '../submodules/messaging/app-channels';
import {
  memberToResponseDto,
  messagingToResponseDto,
  messageToResponseDto,
  userToResponseDto,
  pinnedToResponseDtoTransformer,
} from '../transformers';
import { MessageHttpResponseDto } from '../dto';
import { ChatOnlineMemberInterface } from '../schemas';
import { SocketIoEmitterService } from '../services';
import * as createEmitter from 'socket.io-emitter';


@MessagingProducer()
@Injectable()
export class MerchantChatServerProducer implements ProducerInterface {
  // tslint:disable-next-line: typedef
  private get io(): ReturnType<typeof createEmitter> {
    return this.socketIoEmitterService.of('chat');
  }

  constructor(
    private readonly commonMessagingService: CommonMessagingService,
    private readonly socketIoEmitterService: SocketIoEmitterService,
  ) {
  }

  public canProduce(): boolean {
    return true;
  }

  public async contactCreated(contact: ContactDocument): Promise<void> {
    this.io
      .to(this.commonMessagingService.getRoomIdByBusinessId(contact.business))
      .emit(WsOutgoingMessageEventCodeEnum.WsClientContactCreated, contact);
  }

  public async contactUpdated(contact: ContactDocument): Promise<void> {
    this.io
      .to(this.commonMessagingService.getRoomIdByBusinessId(contact.business))
      .emit(WsOutgoingMessageEventCodeEnum.WsClientContactUpdated, contact);
  }

  public async contactStatus(contact: ContactDocument): Promise<void> {
    this.io
      .to(this.commonMessagingService.getRoomIdByBusinessId(contact.business))
      .emit(WsOutgoingMessageEventCodeEnum.WsClientContactStatus, contact);
  }

  public async memberIncluded(
    chat: AbstractMessagingDocument,
    user: UserDocument,
    member: ChatMember,
  ): Promise<void> {
    this.io
      .to(this.commonMessagingService.getRoomIdByChatId(chat._id))
      .emit(
        WsOutgoingMessageEventCodeEnum.WsClientMemberIncludedToChat,
        userToResponseDto(user),
        memberToResponseDto(member),
        messagingToResponseDto(chat),
      );
    this.io
      .to(this.commonMessagingService.getRoomIdByUserId(member.user))
      .emit(
        WsOutgoingMessageEventCodeEnum.WsClientMemberIncludedToChat,
        userToResponseDto(user),
        memberToResponseDto(member),
        messagingToResponseDto(chat),
      );
  }

  public async memberChanged(
    chat: AbstractMessagingDocument,
    user: UserDocument,
    member: ChatMember,
  ): Promise<void> {
    this.io
      .to(this.commonMessagingService.getRoomIdByUserId(user._id))
      .emit(
        WsOutgoingMessageEventCodeEnum.WsClientMemberChanged,
        userToResponseDto(user),
        memberToResponseDto(member),
        messagingToResponseDto(chat),
      );
  }

  public async memberExcluded(
    chat: AbstractMessagingDocument,
    user: UserDocument | null,
    member: ChatMember,
  ): Promise<void> {
    this.io
      .to(this.commonMessagingService.getRoomIdByChatId(chat._id))
      .emit(
        WsOutgoingMessageEventCodeEnum.WsClientMemberExcludedFromChat,
        {
          chatId: chat._id,
          member: memberToResponseDto(member),
          user: userToResponseDto(user),
        },
      );
  }

  public async memberLeft(
    chat: AbstractMessagingDocument,
    user: UserDocument | null,
    member: ChatMember,
  ): Promise<void> {
    this.io
      .to(this.commonMessagingService.getRoomIdByChatId(chat._id))
      .emit(
        WsOutgoingMessageEventCodeEnum.WsClientMemberLeftRoom,
        {
          chatId: chat._id,
          member: memberToResponseDto(member),
          user: userToResponseDto(user),
        },
      );
  }

  public async chatCreated(chat: AbstractMessagingDocument): Promise<void> {
    if (
      AbstractMessaging.hasBusiness(chat) &&
      AbstractMessaging.hasIntegrationType(chat, MessagingIntegrationsEnum.LiveChat)
    ) {
      this.io
        .to(this.commonMessagingService.getRoomIdByBusinessId(chat.business))
        .emit(WsOutgoingMessageEventCodeEnum.WsClientChatCreated, messagingToResponseDto(chat));
    }
    for (const member of chat.members) {
      this.io
        .to(this.commonMessagingService.getRoomIdByUserId(member.user))
        .emit(WsOutgoingMessageEventCodeEnum.WsClientChatCreated, messagingToResponseDto(chat));
    }
  }

  public async chatUpdated(chat: AbstractMessagingDocument): Promise<void> {
    if (
      AbstractMessaging.hasBusiness(chat) &&
      AbstractMessaging.hasIntegrationType(chat, MessagingIntegrationsEnum.LiveChat)
    ) {
      this.io
        .to(this.commonMessagingService.getRoomIdByBusinessId(chat.business))
        .emit(WsOutgoingMessageEventCodeEnum.WsClientChatUpdated, messagingToResponseDto(chat));
    }
    for (const member of chat.members) {
      this.io
        .to(this.commonMessagingService.getRoomIdByUserId(member.user))
        .emit(WsOutgoingMessageEventCodeEnum.WsClientChatUpdated, messagingToResponseDto(chat));
    }
  }

  public async chatDeleted(chat: AbstractMessagingDocument): Promise<void> {
    if (
      AbstractMessaging.hasBusiness(chat) &&
      AbstractMessaging.hasIntegrationType(chat, MessagingIntegrationsEnum.LiveChat)
    ) {
      this.io
        .to(this.commonMessagingService.getRoomIdByBusinessId(chat.business))
        .emit(WsOutgoingMessageEventCodeEnum.WsClientChatDeleted, messagingToResponseDto(chat));
    }
    for (const member of chat.members) {
      this.io
        .to(this.commonMessagingService.getRoomIdByUserId(member.user))
        .emit(WsOutgoingMessageEventCodeEnum.WsClientChatDeleted, messagingToResponseDto(chat));
    }
  }

  public async chatMessagePinned(chat: AbstractMessagingDocument, pinned: Pinned, message: MessageHttpResponseDto,
  ): Promise<void> {
    const userId: string = pinned.pinner;
    if (!pinned.forAllUsers) {
      this.io
        .to(this.commonMessagingService.getRoomIdByUserId(userId))
        .emit(WsOutgoingMessageEventCodeEnum.WsClientMessagePinned, {
          chat: messagingToResponseDto(chat),
          message,
          pinned: pinnedToResponseDtoTransformer(pinned, { forUser: userId }),
        });
    } else {
      this.io
        .to(this.commonMessagingService.getRoomIdByChatId(chat._id))
        .emit(WsOutgoingMessageEventCodeEnum.WsClientMessagePinned, {
          chat: messagingToResponseDto(chat),
          message,
          pinned: pinnedToResponseDtoTransformer(pinned),
        });
    }
  }

  public async chatMessageUnpinned(chat: AbstractMessagingDocument, unpinned: Pinned): Promise<void> {
    const userId: string = unpinned.pinner;
    if (!unpinned.forAllUsers) {
      this.io
        .to(this.commonMessagingService.getRoomIdByUserId(userId))
        .emit(WsOutgoingMessageEventCodeEnum.WsClientMessageUnpinned, {
          chat: messagingToResponseDto(chat),
          pinned: pinnedToResponseDtoTransformer(unpinned, { forUser: userId }),
        });
    } else {
      this.io
        .to(this.commonMessagingService.getRoomIdByChatId(chat._id))
        .emit(WsOutgoingMessageEventCodeEnum.WsClientMessageUnpinned, {
          chat: messagingToResponseDto(chat),
          pinned: pinnedToResponseDtoTransformer(unpinned),
        });
    }
  }

  public async messagesUpdated(
    messages: AbstractChatMessageDocument[],
    chat: AbstractMessagingDocument,
  ): Promise<void> {
    for (const message of messages) {
      this.io
        .to(this.commonMessagingService.getRoomIdByChatId(message.chat))
        .emit(
          WsOutgoingMessageEventCodeEnum.WsClientMessageUpdated,
          messageToResponseDto(await this.decryptMessage(message, chat.salt)),
        );
    }
  }

  public async messagesUpdatedWithList(
    messages: AbstractChatMessageDocument[],
    chat: AbstractMessagingDocument,
  ): Promise<void> {
    const messagesDecrypt: AbstractChatMessage[] = await Promise.all(
      messages.map(async (message: AbstractChatMessageDocument) =>
        this.decryptMessage(message, chat.salt),
      ));
    const messageToResponse: MessageHttpResponseDto[] =
      messagesDecrypt.map((msg: AbstractChatMessage) => messageToResponseDto(msg));
    this.io
      .to(this.commonMessagingService.getRoomIdByChatId(messages[0].chat))
      .emit(
        WsOutgoingMessageEventCodeEnum.WsClientListMessageUpdated,
        messageToResponse,
      );
  }

  public async messagesDeleted(
    messages: AbstractChatMessageDocument[],
    chat: AbstractMessagingDocument,
  ): Promise<void> {
    for (const message of messages) {
      this.io
        .to(this.commonMessagingService.getRoomIdByChatId(message.chat))
        .emit(
          WsOutgoingMessageEventCodeEnum.WsClientMessageDeleted,
          messageToResponseDto(await this.decryptMessage(message, chat.salt)),
        );
    }
  }

  public async messagesListDeleted(
    messages: AbstractChatMessageDocument[],
    chat: AbstractMessagingDocument,
  ): Promise<void> {

    const messagesDecrypt: AbstractChatMessage[] = await Promise.all(
      messages.map((message: AbstractChatMessageDocument) => this.decryptMessage(message, chat.salt)),
    );

    this.io
      .to(this.commonMessagingService.getRoomIdByChatId(messages[0].chat))
      .emit(
        WsOutgoingMessageEventCodeEnum.WsClientMessageDeleted,
        messagesDecrypt.map((message: AbstractChatMessage) => messageToResponseDto(message)),
      );
  }

  public async messagesPosted(
    messages: AbstractChatMessageDocument[],
    chat: AbstractMessagingDocument,
  ): Promise<void> {
    for (const message of messages) {
      const room: string =
        (message as any).isFirstMessage ?
          this.commonMessagingService.getRoomIdByBusinessId((message as any).businessId) :
          this.commonMessagingService.getRoomIdByChatId(message.chat);
      this.io
        .to(room)
        .emit(
          WsOutgoingMessageEventCodeEnum.WsClientMessagePosted,
          messageToResponseDto(await this.decryptMessage(message, chat.salt)),
        );
    }
  }

  public async userStatusUpdated(
    user: UserDocument | null,
    lastSeen: Date,
    status: ChatMemberStatusEnum,
  ): Promise<void> {
    for (const businessId of user.businesses) {
      this.io
        .to(businessId)
        .emit(WsOutgoingMessageEventCodeEnum.WsClientUserStatus, {
          lastSeen,
          status,
          user: user._id,
        });
    }
  }

  public async initialAppChannelsCreated(
    businessId: string,
    appChannels: AppChannelDocument[],
  ): Promise<void> {
    this.io
      .to(this.commonMessagingService.getRoomIdByBusinessId(businessId))
      .emit(WsOutgoingMessageEventCodeEnum.WsClientInitialAppChannelsCreated, {
        channels: appChannels,
      });
  }

  public async typingUpdated(
    chat: AbstractMessagingDocument,
    member: ChatOnlineMemberInterface,
    isTyping: boolean,
    typingMembers: ChatOnlineMemberInterface[],
  ): Promise<void> {
    this.io
      .to(this.commonMessagingService.getRoomIdByChatId(chat?.id))
      .emit(WsOutgoingMessageEventCodeEnum.WsClientChatTypingMembersUpdated, {
        _id: chat._id,
        isTyping,
        member,
        typingMembers,
      });
  }

  public async onlineMembersUpdated(
    chat: AbstractMessagingDocument,
    onlineMembers: ChatOnlineMemberInterface[],
    onlineMembersCount: number,
  ): Promise<void> {
    this.io
      .to(this.commonMessagingService.getRoomIdByChatId(chat._id))
      .emit(WsOutgoingMessageEventCodeEnum.WsClientChatOnlineMembersUpdated, {
        _id: chat._id,
        onlineMembers,
        onlineMembersCount,
      });
  }

  private async decryptMessage(message: AbstractChatMessageDocument, salt: string): Promise<AbstractChatMessage> {
    return this.commonMessagingService.decryptMessage(message, salt);
  }
}
