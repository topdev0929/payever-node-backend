/* eslint-disable @typescript-eslint/dot-notation */
import { v4 as uuid } from 'uuid';
import { Cursor } from 'mongodb';
import { QueryCursor } from 'mongoose';
import { Logger, Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Encryption, RabbitMqClient, RedisClient, UserTokenInterface } from '@pe/nest-kit';
import {
  ChatMessageStatusEnum,
  ChatMemberStatusEnum,
  MessagingTypeEnum,
  ChatTextMessageDocument,
  MessagingIntegrationsEnum,
} from '@pe/message-kit';

import { WsOutgoingMessageEventCodeEnum, WsVoteCodes } from '../enums';
import { SocketWithToken } from '../interfaces/ws-socket-local.interface';
import { DecodedUserTokenInterface } from '../interfaces/decoded-token.interface';
import { WsGateway } from './ws.gateway';
import { EventOriginEnum, ExcludeMemberTypeEnum } from '../../message/enums';
import {
  AbstractMessagingDocument,
  ChatMessageService,
  AbstractChatMessageDocument,
  CommonMessagingService,
  ChatTextMessage,
  CHAT_MAX_LAST_MESSAGES,
  ChatTypingMembersService,
  ChatOnlineMembersService,
  MessagesRedisService,
} from '../../message/submodules/platform';
import {
  MessageCreateWsRequestDto,
  MessageDeleteWsRequestDto,
  MemberUpdateWsRequestDto,
  MessageUpdateWsRequestDto,
  ForwardMessageWsRequestDto,
  CreateMessageScrollerDto,
  ExcludeMemberDto,
  UnreadMessagesCountRequestDto,
  MessageListDeleteWsRequestDto,
  UserOnlineStateDto,
} from '../dto';
import { UsersService } from '../../projections/services';
import { UserDocument } from '../../projections/models';
import { BasicWsService } from './basic.ws-service';
import { VoteCodes } from '../../message/const';
import { messageToResponseDto, messagingToResponseDto, transformWithOptions } from '../../message/transformers';
import { MENTIONS_REGEX } from '../../common';
import { ChatMessageWsResponseDto } from '../dto/outgoing';
import { ChatOnlineMemberInterface, ProfileService, SocketIoEmitterService } from '../../message';
import { MessageHttpResponseDto, PinMessageDto, UnpinMessageDto } from '../../message/dto';
import {
  ChatBoxMessageDocument,
  ChatBoxMessage,
  DecryptedAbstractChatMessageInterface,
  Pinned,
  PinnedEmbeddedDocument,
} from '../../message/submodules/platform/schemas';
import { StompService } from '@pe/stomp-client';
import { StompTopicsEnum } from '../../consumer/enums';
import { UserOnlineStateService } from './user-online-state-service';


@Injectable()
export class WsService extends BasicWsService {
  private readonly scrollers: {
    [key: string]: {
      [key: string]: QueryCursor<AbstractChatMessageDocument>;
    };
  } = { };
  constructor(
    logger: Logger,
    jwt: JwtService,
    private readonly messagesGateway: WsGateway,
    readonly rabbitMqClient: RabbitMqClient,
    private readonly commonMessagingService: CommonMessagingService,
    private readonly chatMessageService: ChatMessageService,
    private readonly chatTypingService: ChatTypingMembersService,
    private readonly chatOnlineService: ChatOnlineMembersService,
    private readonly usersService: UsersService,
    private readonly redisClient: RedisClient,
    private readonly profileService: ProfileService,
    private readonly socketIoEmitterService: SocketIoEmitterService,
    private readonly messageRedisService: MessagesRedisService,
    private readonly stompService: StompService,
    private readonly userOnlineService: UserOnlineStateService,
  ) {
    super(
      logger,
      jwt,
      messagesGateway,
    );
  }

  public async initialOnlineCacheData(): Promise<void> {
    await this.chatTypingService.clearAllCacheData();
    await this.chatOnlineService.clearAllCacheData();
  }

  public async handleConnectionEvent(
    clientSocket: SocketWithToken,
  ): Promise<void> {
    this.logger.log(`Client connected '${clientSocket.id}'`, 'Merchantchat');
    const token: string = clientSocket.handshake.query.token;
    let userId: string;
    try {
      const decoded: DecodedUserTokenInterface = await this.jwt.verifyAsync(token);
      if (!decoded.user) {
        clientSocket.disconnect();
      }
      const user: UserDocument = await this.usersService.findById(decoded.user.id);
      if (!user) {
        throw new NotFoundException(`User with _id '${decoded.user.id}' not found.`);
      }

      const redisToken: string = await this.redisClient.getClient().get(decoded.user.tokenId);

      userId = user._id;
      await this.userOnlineService.addOnlineUser
        ({ type: 'user', userId, name: `${user.userAccount?.firstName} ${user.userAccount?.lastName}` });

      clientSocket.decodedToken = redisToken ? { user: JSON.parse(redisToken) } : decoded;
      await this.profileService.setStatus(
        clientSocket.decodedToken.user.id,
        ChatMemberStatusEnum.Online,
      );
      const onlines: UserOnlineStateDto[] = await this.userOnlineService.getOnlineUsers();

      clientSocket.emit('authenticated', user);
      clientSocket.emit(WsOutgoingMessageEventCodeEnum.WsClientOnlineUsers, { onlines });
      
      if (decoded.user.tokenId) {
        const businessId: string = decoded.user.tokenId.split('|')[1];
        const businessRoomId: string = this.commonMessagingService.getRoomIdByBusinessId(businessId);
        clientSocket.join(businessRoomId);
        this.stompService.publishJson(StompTopicsEnum.OnlineUserRefresh, { businessId });
      }
      const userRoomCode: string = this.commonMessagingService.getRoomIdByUserId(user._id);
      clientSocket.join(userRoomCode);
      await this.chatOnlineService.addMemberSocketId(user._id, clientSocket.id);
      clientSocket.emit(WsOutgoingMessageEventCodeEnum.WsClientMemberJoinedRoom, userRoomCode);
      // TODO: Add user-member session, Persist session _id on client-side
      this.logger.log(`Client authenticated '${clientSocket.id}'`, 'Merchantchat');
    } catch (e) {
      clientSocket.emit('unauthorized', {
        data: e,
      });
      clientSocket.disconnect();
      await this.userOnlineService.removeOnlineUser(userId);
      this.logger.log(`Client unauthorized '${clientSocket.id}'`, 'Merchantchat');
    }
  }

  public async handleDisconnectEvent(
    clientSocket: SocketWithToken,
  ): Promise<void> {
    // TODO: Remove user-member session
    const userId: string = clientSocket.decodedToken?.user?.id;

    await this.chatOnlineService.removeConnectionFromAllChats(
      clientSocket.id,
      EventOriginEnum.MerchantChatServer,
    );

    await this.profileService.setStatus(
      userId,
      ChatMemberStatusEnum.Offline,
    );

    const onlines: UserOnlineStateDto[] = await this.userOnlineService.removeOnlineUser(userId);

    if (clientSocket.decodedToken.user.tokenId) {
      const businessId: string = clientSocket.decodedToken.user.tokenId.split('|')[1];
      const businessRoomId: string = this.commonMessagingService.getRoomIdByBusinessId(businessId);
      clientSocket.to(businessRoomId).emit(WsOutgoingMessageEventCodeEnum.WsClientOnlineUsers, { onlines });
      this.stompService.publishJson(StompTopicsEnum.OnlineUserRefresh, { businessId });
    }

    this.socketIoEmitterService.removeSocket(clientSocket.id);
    await this.chatOnlineService.removeMemberSocketId(userId, clientSocket.id);
  }

  public async joinMemberToBusinessRoom(
    clientSocket: SocketWithToken,
    businessId: string,
    reqId: string,
  ): Promise<void> {
    await this.denyAccessUnlessGranted(
      WsVoteCodes.JOIN_TO_BUSINESS_ROOM,
      clientSocket.decodedToken.user,
      businessId, `You have not access to business '${businessId}'`,
    );
    const room: string = this.commonMessagingService.getRoomIdByBusinessId(businessId);
    clientSocket.join(room);
    clientSocket.emit(WsOutgoingMessageEventCodeEnum.WsClientMemberJoinedRoom,
      this.prepareMessageResponse(room, reqId));
    clientSocket.to(room).emit(WsOutgoingMessageEventCodeEnum.WsClientMemberJoinedRoom, room);
  }

  public async joinMemberToChatRoom(
    clientSocket: SocketWithToken,
    chatId: string,
  ): Promise<void> {
    const chat: AbstractMessagingDocument = await this.commonMessagingService.findById(chatId);
    await this.denyAccessUnlessGranted(
      WsVoteCodes.JOIN_TO_ROOM,
      chat,
      {
        userToken: clientSocket.decodedToken.user,
      },
      `You are not a member of chat '${chatId}'`,
    );

    const room: string = this.commonMessagingService.getRoomIdByChatId(chatId);
    clientSocket.join(room);
    clientSocket.to(room).emit(WsOutgoingMessageEventCodeEnum.WsClientMemberJoinedRoom, room);

    const userId: string = clientSocket.decodedToken.user.id;
    await this.chatOnlineService.addOnlineMember(
      clientSocket.id,
      chatId,
      userId,
      null,
      EventOriginEnum.MerchantChatServer,
    );
  }

  public async leaveMemberFromChatRoom(
    clientSocket: SocketWithToken,
    chatId: string,
  ): Promise<void> {
    const room: string = this.commonMessagingService.getRoomIdByChatId(chatId);
    const userId: string = clientSocket.decodedToken.user.id;

    await this.chatOnlineService.removeOnlineMember(
      clientSocket.id,
      chatId,
      userId,
      null,
      EventOriginEnum.MerchantChatServer,
    );
    clientSocket.to(room).emit(WsOutgoingMessageEventCodeEnum.WsClientMemberLeftRoom, { chatId, userId });
    clientSocket.leave(room);
  }

  public async leaveMemberFromChat(
    clientSocket: SocketWithToken,
    chatId: string,
  ): Promise<void> {
    const userToken: UserTokenInterface = clientSocket.decodedToken.user;
    const chat: AbstractMessagingDocument = await this.commonMessagingService.findById(chatId);
    await this.denyAccessUnlessGranted(
      VoteCodes.LEAVE_MESSAGING,
      chat,
      { userToken },
      `You can not leave the chat '${chat._id}'`,
    );
    await this.commonMessagingService.excludeMemberFromChat(chat, userToken.id, ExcludeMemberTypeEnum.left);
    await this.handleExcludedMemberSockets(chatId, userToken.id, null);
  }

  public async excludeMemberFromChat(
    clientSocket: SocketWithToken,
    data: ExcludeMemberDto,
  ): Promise<void> {
    const userToken: UserTokenInterface = clientSocket.decodedToken.user;
    const chat: AbstractMessagingDocument = await this.commonMessagingService.findById(data.chatId);
    const userToExclude: UserDocument = await this.usersService.findById(data.userId);
    await this.denyAccessUnlessGranted(
      VoteCodes.EXCLUDE_MEMBER,
      chat,
      { userToken, userToExclude },
      `You have no permission to exclude from group '${chat._id}'`,
    );
    await this.commonMessagingService.removeMember(chat, userToExclude, { removedBy: userToken.id });
    await this.handleExcludedMemberSockets(data.chatId, userToExclude.id, null);
  }

  public async handleSendMessage(
    clientSocket: SocketWithToken,
    dto: MessageCreateWsRequestDto,
  ): Promise<ChatMessageWsResponseDto> {
    
    const chat: AbstractMessagingDocument = await this.commonMessagingService.findById(dto.chat);
    await this.denyAccessUnlessGranted(
      VoteCodes.CREATE_MESSAGE,
      chat,
      { userToken: clientSocket.decodedToken.user },
      `You can't send messages to this ${chat.type}`,
    );
    if (dto.attachments && Array.isArray(dto.attachments) && dto.attachments.length > 0) {
      await this.denyAccessUnlessGranted(
        VoteCodes.SEND_MEDIA,
        chat,
        { userToken: clientSocket.decodedToken.user },
        `You can't post media to this ${chat.type}`,
      );
    }

    const room: string = this.commonMessagingService.getRoomIdByChatId(dto.chat);
    clientSocket.join(room);

    const messagePrototype: ChatMessageWsResponseDto = {
      _id: uuid(),
      attachments: [],
      ...dto,
      createdAt: null,
      editedAt: null,
      sender: clientSocket.decodedToken.user.id,
      status: ChatMessageStatusEnum.SENT,
      updatedAt: null,
    };

    try {
      if (dto.type === 'text') {
        let content: string;
        let mentions: string[] = [];
        
        if (messagePrototype.content) {
          mentions = messagePrototype.content.match(MENTIONS_REGEX) || [];
          mentions = mentions.map((item: string) => item.replace('<@', '').replace('>', ''));
          content = await Encryption.encryptWithSalt(dto.content, chat.salt);
        }
        const contentType: string = dto.contentType ?
          await Encryption.encryptWithSalt(dto.contentType, chat.salt) : null;
        let replyToContent: any = '';
        const replyTo: string = messagePrototype.replyTo;
        if (replyTo) {
          replyToContent = await this.chatMessageService.getReplyData(replyTo);
        }
        const textMessagePrototype: ChatTextMessage = {
          attachments: [],
          ...messagePrototype,
          content,
          contentType,
          data: { },
          mentions,
          replyTo: messagePrototype.replyTo,
          replyToContent: messagePrototype.replyTo ? replyToContent.content || null : null,
          sender: clientSocket.decodedToken.user.id,
          type: 'text',
        };

        const [messageData]: ChatTextMessage[] = await this.chatMessageService.create(
          [textMessagePrototype],
          EventOriginEnum.MerchantChatServer,
        );

        const chatObj: any = { ...chat.toObject() };

        if (chatObj.integrationName === MessagingIntegrationsEnum.Email) {
                   
          await this.rabbitMqClient.send(
            {
              channel: 'message.event.message.send-email',
              exchange: 'async_events',
            },
            {
              name: 'message.event.message.send-email',
              payload: {
                business: {
                  id: chatObj.business,
                },
                email: {
                  content: dto.content,
                  inReplyTo: replyToContent?.emailId || null,
                  to: chatObj.email,
                },
                id: chatObj.business,
                messageId: messageData._id,
              },
            },
          );
        }
      } else {
        await this.chatMessageService.create(
          [messagePrototype],
          EventOriginEnum.MerchantChatServer,
        );
      }
    } catch (err) {
      await this.withdrawChatMessageFromRoom(messagePrototype, err);
    }

    return messagePrototype;
  }


  public async handleForwardMessages(
    clientSocket: SocketWithToken,
    dto: ForwardMessageWsRequestDto,
  ): Promise<ChatMessageWsResponseDto[]> {
    const targetChat: AbstractMessagingDocument =
      await this.commonMessagingService.findById(dto.chat);
    await this.denyAccessUnlessGranted(
      VoteCodes.CREATE_MESSAGE,
      targetChat,
      { userToken: clientSocket.decodedToken.user },
      `You can't send messages to this ${targetChat.type}`,
    );

    const prototypes: Array<ChatTextMessage | ChatBoxMessage> = [];

    for (const _id of dto.ids) {
      const originalMessage: AbstractChatMessageDocument =
        await this.chatMessageService.findById(_id);

      if (!originalMessage) {
        continue;
      }

      if (ChatTextMessage.isTypeOf(originalMessage)) {
        prototypes.push(
          await this.createForwardTextMessage(
            originalMessage,
            clientSocket,
            dto,
            targetChat,
            _id,
          ),
        );
      }

      if (ChatBoxMessage.isTypeOf(originalMessage)) {
        prototypes.push(
          await this.createForwardBoxMessage(
            originalMessage,
            clientSocket,
            dto,
            targetChat,
            _id,
          ),
        );
      }
    }

    const forwardedMessages: Array<ChatTextMessage | ChatBoxMessage> =
      await this.chatMessageService.create(
        prototypes,
        EventOriginEnum.MerchantHttpServer,
      );

    return forwardedMessages.map(
      transformWithOptions(messageToResponseDto)({
        forUser: clientSocket.decodedToken.user.id,
      }),
    );
  }

  public async handleUpdateMessage(
    clientSocket: SocketWithToken,
    dto: MessageUpdateWsRequestDto,
  ): Promise<void> {
    const message: AbstractChatMessageDocument = await this.chatMessageService.findById(dto._id);

    if (ChatTextMessage.isTypeOf(message) && message.sender !== clientSocket.decodedToken.user.id) {
      throw new ForbiddenException(`You can't update non-owned messages`);
    }
    const chat: AbstractMessagingDocument = await this.commonMessagingService.findById(message.chat);

    if (ChatTextMessage.isTypeOf(message)) {
      let mentions: string[] = [];
      if (dto.content) {
        mentions = dto.content.match(MENTIONS_REGEX) || [];
        mentions = mentions.map((item: string) => item.replace('<@', '').replace('>', ''));
        dto.content = await Encryption.encryptWithSalt(dto.content, chat.salt);
      }
      if (dto.contentType !== undefined) {
        dto.contentType = await Encryption.encryptWithSalt(dto.contentType, chat.salt);
      }

      await this.chatMessageService.update({
        $set: {
          ...dto,
          mentions: dto.content ? mentions : message.mentions,
        },
        _id: dto._id,
      }, EventOriginEnum.MerchantChatServer);
    } else {
      await this.chatMessageService.update({
        $set: dto,
        _id: dto._id,
      }, EventOriginEnum.MerchantChatServer);
    }
  }

  public async handleMarkMessageRead(
    clientSocket: SocketWithToken,
    messagesId: string | string[],
  ): Promise<void> {
    if (typeof messagesId === 'string') {
      messagesId = [messagesId];
    }
    let messages: Array<AbstractChatMessageDocument | undefined> =
      await Promise.all(messagesId.map((messageId: string) => this.prepareMessage(clientSocket, messageId)));
    messages = messages.filter((v: AbstractChatMessageDocument | undefined) => v);
    if (messages.length <= 0) {
      return;
    }
    await this.chatMessageService.markAsRead(
      messages,
      clientSocket.decodedToken.user.id,
      EventOriginEnum.MerchantChatServer,
    );
  }

  public async handleMarkListMessageRead(
    clientSocket: SocketWithToken,
    messagesId: string[],
  ): Promise<void> {
    if (typeof messagesId === 'string') {
      messagesId = [messagesId];
    }
    let messages: Array<AbstractChatMessageDocument | undefined> =
      await Promise.all(messagesId.map((messageId: string) => this.prepareMessage(clientSocket, messageId)));
    messages = messages.filter((v: AbstractChatMessageDocument | undefined) => v);
    if (messages.length <= 0) {
      return;
    }
    await this.chatMessageService.markAsReadWithList(
      messages,
      clientSocket.decodedToken.user.id,
      EventOriginEnum.MerchantChatServer,
    );
  }

  public async prepareMessage(
    clientSocket: SocketWithToken,
    messageId: string,
  ): Promise<AbstractChatMessageDocument> {
    const message: AbstractChatMessageDocument =
      await this.messageRedisService.getMessageById(messageId) ||
      await this.chatMessageService.findById(messageId);

    if (!message) {
      throw new NotFoundException(`Message with id '${messageId}' not found`);
    }
    if (message.readBy?.includes(clientSocket.decodedToken.user.id)) {
      return;
    }
    const chat: AbstractMessagingDocument = await this.commonMessagingService.findById(message.chat);
    await this.denyAccessUnlessGranted(VoteCodes.MARK_MESSAGE_READ, {
      chat,
      message,
    }, clientSocket.decodedToken.user, `You have no access to message '${messageId}' of chat '${message.chat}'`);

    return message;
  }

  public async handleMarkMessageUnread(
    clientSocket: SocketWithToken,
    messageId: string,
  ): Promise<void> {
    const message: AbstractChatMessageDocument =
      await this.messageRedisService.getMessageById(messageId) ||
      await this.chatMessageService.findById(messageId);

    if (!message) {
      throw new NotFoundException(`Message with id '${messageId}' not found`);
    }
    if (!message.readBy?.includes(clientSocket.decodedToken.user.id)) {
      return;
    }
    const chat: AbstractMessagingDocument = await this.commonMessagingService.findById(message.chat);
    await this.denyAccessUnlessGranted(VoteCodes.MARK_MESSAGE_READ, {
      chat,
      message,
    }, clientSocket.decodedToken.user, `You have no access to message '${messageId}' of chat '${message.chat}'`);

    await this.chatMessageService.markUnread(
      message,
      clientSocket.decodedToken.user.id,
      EventOriginEnum.MerchantChatServer,
    );
  }

  public async handlePinMessage(
    clientSocket: SocketWithToken,
    data: PinMessageDto,
  ): Promise<void> {

    const message: AbstractChatMessageDocument = await this.chatMessageService.findById(data.messageId);
    if (!message) {
      throw new NotFoundException(`Message with id '${data.messageId}' not found`);
    }

    const chat: AbstractMessagingDocument = await this.commonMessagingService.findById(message.chat);
    await this.denyAccessUnlessGranted(
      VoteCodes.PIN_MESSAGE,
      chat,
      { userToken: clientSocket.decodedToken.user },
      `You can't send message to this ${chat.type}`,
    );

    const forcePinForAllUsers: boolean = [
      MessagingTypeEnum.CustomerChat,
      MessagingTypeEnum.DirectChat,
    ].includes(chat.type);

    data.forAllUsers = data.forAllUsers || forcePinForAllUsers;

    if (
      data.forAllUsers &&
      chat.pinned?.find((pinned: PinnedEmbeddedDocument) => pinned.forAllUsers && pinned.messageId === message._id)) {
      throw new BadRequestException(`message with id:${message._id} already pinned for all`);
    }

    const decryptedMessage: DecryptedAbstractChatMessageInterface =
      await this.commonMessagingService.decryptMessage(message, chat.salt);

    const messageHttpReponseDto: MessageHttpResponseDto =
      transformWithOptions(messageToResponseDto)({ forUser: null })(decryptedMessage);

    const userId: string = clientSocket.decodedToken.user.id;
    const pinId: string = uuid();

    data.contacts = chat.members.filter((a) => a.guestUser).map((a) => a.guestUser?.contactId);
    data._id = pinId;
    this.stompService.publishJson(StompTopicsEnum.MessagePinMessage, {
      chat: messagingToResponseDto(chat),
      message : decryptedMessage,
      pinned: data,
    });

    await this.commonMessagingService.pinMessage(
      message.chat,
      {
        _id: pinId,
        forAllUsers: data.forAllUsers,
        messageId: message._id,
        notifyAllMembers: data.notifyAllMembers,
        pinner: userId,
      },
      EventOriginEnum.MerchantChatServer,
      messageHttpReponseDto,
    );
  }

  public async handleUnpinMessage(
    clientSocket: SocketWithToken,
    data: UnpinMessageDto,
  ): Promise<void> {
    const chat: AbstractMessagingDocument = await this.commonMessagingService.findById(data.chatId);
    await this.denyAccessUnlessGranted(
      VoteCodes.PIN_MESSAGE,
      chat,
      { userToken: clientSocket.decodedToken.user },
      `You can't send message to this ${chat.type}`,
    );

    const pin: Pinned = chat.pinned?.find((p: PinnedEmbeddedDocument) => p._id === data.pinId);

    if (!pin) {
      throw new NotFoundException(`pin with _id ${data.pinId} not found`);
    }

    const pinnedDto: PinMessageDto = {
      _id: pin._id,
      chat: data.chatId,
      contacts: chat.members.filter((a) => a.guestUser).map((a) => a.guestUser?.contactId),
      messageId: pin.messageId,
      sender: null,
    };

    this.stompService.publishJson(StompTopicsEnum.MessageUnpinMessage, {
      chat: messagingToResponseDto(chat),
      pinned: pinnedDto,
    });
    await this.commonMessagingService.unpinMessage(
      data.chatId,
      data.pinId,
      EventOriginEnum.MerchantChatServer,
    );
  }

  public async handleDeleteMessage(
    clientSocket: SocketWithToken,
    dto: MessageDeleteWsRequestDto,
  ): Promise<void> {
    const message: AbstractChatMessageDocument = await this.chatMessageService.findById(dto._id);
    if (dto.deleteForEveryone && message.sender !== clientSocket.decodedToken.user.id) {
      throw new ForbiddenException(`You can't delete non-owned messages`);
    }

    await this.chatMessageService.delete(
      dto._id,
      EventOriginEnum.MerchantChatServer,
      dto.deleteForEveryone ? null : clientSocket.decodedToken.user,
    );
  }

  public async handleDeleteListMessage(
    clientSocket: SocketWithToken,
    dto: MessageListDeleteWsRequestDto,
  ): Promise<void> {

    if (dto._ids.length > 30) {
      throw new BadRequestException(`You cannot send more than 30 messages in one request`);
    }

    const messageIds: Array<string | null> = await Promise.all((dto._ids).map((data: string) =>
      this.checkCanDeleteMessage(data, clientSocket, dto.deleteForEveryone)));

    const ids: string[] = messageIds.filter((id: string | null) => id);

    const deleteFor: null | UserTokenInterface = dto.deleteForEveryone ? null : clientSocket.decodedToken.user;

    if (deleteFor) {
      await this.chatMessageService.deleteForMe(
        ids,
        EventOriginEnum.MerchantChatServer,
        deleteFor,
      );
    } else {
      await this.chatMessageService.deleteForEveryone(
        ids,
        EventOriginEnum.MerchantChatServer,
      );
    }
  }

  public async checkCanDeleteMessage(
    id: string,
    clientSocket: SocketWithToken,
    deleteForEveryone: boolean,
  ): Promise<string | null> {
    const message: AbstractChatMessageDocument = await this.chatMessageService.findById(id);
    if (deleteForEveryone && message.sender !== clientSocket.decodedToken.user.id) {
      throw new ForbiddenException(`You can't delete non-owned messages`);
    }

    return id;
  }

  public async handleUpdateMember(
    clientSocket: SocketWithToken,
    dto: MemberUpdateWsRequestDto,
  ): Promise<void> {
    await this.profileService.setStatus(
      clientSocket.decodedToken.user.id,
      dto.status,
    );
  }

  public async sendChatMessageToRoom(
    body: ChatMessageWsResponseDto,
  ): Promise<void> {
    this.messagesGateway.server
      .to(body.chat)
      .emit(WsOutgoingMessageEventCodeEnum.WsClientMessagePosted, body);
  }

  public async scroll(
    clientSocket: SocketWithToken,
    data: CreateMessageScrollerDto,
    reqId: string,
  ): Promise<void> {
    if (!this.scrollers[clientSocket.decodedToken.user.id]) {
      this.scrollers[clientSocket.decodedToken.user.id] = { };
    }
    const userId: string = clientSocket.decodedToken.user?.id;
    const scrollId: string = `${userId}-${data._id}`;
    let skip: number = 0;

    const chat: AbstractMessagingDocument = await this.commonMessagingService.findById(data.chat);
    if (!this.scrollers[userId][scrollId]) {
      await this.denyAccessUnlessGranted(
        VoteCodes.READ_MESSAGING,
        chat,
        {
          userToken: clientSocket.decodedToken.user,
        },
      );
      const newScroller: QueryCursor<AbstractChatMessageDocument> = this.chatMessageService.getStream({
        chat: data.chat,
        deletedForUsers: {
          $nin: [userId],
        },
        status: {
          $ne: ChatMessageStatusEnum.DELETED,
        },
      });

      this.scrollers[userId][scrollId] = newScroller;
      skip = data.skip || 0;
    }

    const scroller: QueryCursor<AbstractChatMessageDocument> = this.scrollers[userId][scrollId];
    let nextMessages: AbstractChatMessageDocument[] = [];

    const nativeCursor: Cursor = scroller['cursor'];
    if (!nativeCursor || !nativeCursor.isClosed()) {
      for await (const nextMessage of scroller) {
        nextMessages.push(nextMessage);
        if (nextMessages.length >= (data.limit || CHAT_MAX_LAST_MESSAGES) + skip) {
          break;
        }
      }
      if (skip) {
        nextMessages = nextMessages.slice(skip);
      }
    }

    await this.chatMessageService.populateObjects(nextMessages);

    clientSocket.emit(
      WsOutgoingMessageEventCodeEnum.WsClientScrollResponse,
      this.prepareMessageResponse(
        {
          _id: data._id,
          chat: data.chat,
          hasNext: !scroller['cursor']?.isClosed(),
          messages: (await Promise.all(
            nextMessages.map(
              (msg: AbstractChatMessageDocument) => this.commonMessagingService.decryptMessage(msg, chat.salt),
            ),
          )).map(transformWithOptions(messageToResponseDto)({
            forUser: userId,
          })),
        },
        reqId,
      ),
    );
  }

  public async handleChatSummaryRequest(
    clientSocket: SocketWithToken,
    chatId: string,
    reqId: string,
  ): Promise<void> {
    const onlineMembers: ChatOnlineMemberInterface[] = await this.chatOnlineService.getChatOnlineMembers(chatId);
    const onlineMembersCount: number = this.chatOnlineService.countOnlineMembers(onlineMembers);
    const typingMembers: ChatOnlineMemberInterface[] = await this.chatTypingService.getChatTypingMembers(chatId);

    clientSocket.emit(
      WsOutgoingMessageEventCodeEnum.WsClientChatSummaryResponse,
      this.prepareMessageResponse(
        {
          chatId,
          onlineMembers,
          onlineMembersCount,
          typingMembers,
        },
        reqId,
      ),
    );
  }

  public async handleMemberTyping(
    clientSocket: SocketWithToken,
    chatId: string,
  ): Promise<void> {
    const userId: string = clientSocket.decodedToken?.user?.id;
    await this.chatTypingService.updateTypingMembers(chatId, null, userId, true, EventOriginEnum.MerchantChatServer);
  }

  public async handleMemberTypingStopped(
    clientSocket: SocketWithToken,
    chatId: string,
  ): Promise<void> {
    const userId: string = clientSocket.decodedToken?.user?.id;
    await this.chatTypingService.updateTypingMembers(chatId, null, userId, false, EventOriginEnum.MerchantChatServer);
  }

  public async handleExcludedMemberSockets(
    chatId: string,
    userId: string,
    contactId: string,
  ): Promise<void> {
    if (!(userId || contactId)) {
      return;
    }

    const room: string = this.commonMessagingService.getRoomIdByChatId(chatId);
    const socketIds: string[] = await this.chatOnlineService.getAllSocketIds(userId || contactId);

    await this.chatOnlineService.removeOnlineMember(
      null,
      chatId,
      userId,
      contactId,
      EventOriginEnum.MerchantChatServer,
    );

    for (const socketId of socketIds) {
      const client: SocketWithToken = this.socketIoEmitterService.getSocket(socketId);
      client?.leave(room);
    }
  }

  public prepareMessageResponse(data: any, reqId: string | undefined): any {
    if (reqId) {
      return {
        data,
        reqId,
      };
    }

    return data;
  }

  public async handleUnreadMessagesCountRequest(
    clientSocket: SocketWithToken,
    dto: UnreadMessagesCountRequestDto,
    reqId: string,
  ): Promise<void> {
    const userId: string = clientSocket.decodedToken?.user?.id;
    if (!userId) {
      throw new BadRequestException('invalid user');
    }

    const unread: string = await this.chatMessageService.getUnreadMessagesCount(
      userId,
      dto.chatId,
      dto.from,
    );

    clientSocket.emit(
      WsOutgoingMessageEventCodeEnum.WsClientChatUnreadMessagesCountResponse,
      this.prepareMessageResponse(
        {
          chatId: dto.chatId,
          from: dto.from,
          unread,
          userId,
        },
        reqId,
      ),
    );
  }

  private async createForwardBoxMessage(
    originalMessage: ChatBoxMessageDocument,
    clientSocket: SocketWithToken,
    dto: ForwardMessageWsRequestDto,
    targetChat: AbstractMessagingDocument,
    _id: string,
  ): Promise<ChatBoxMessage> {
    const originalMessaging: AbstractMessagingDocument =
      await this.commonMessagingService.findById(originalMessage.chat);

    await this.denyAccessUnlessGranted(
      VoteCodes.READ_MESSAGING,
      originalMessaging,
      { userToken: clientSocket.decodedToken.user },
    );

    const forwardSender: boolean = !('withSender' in dto) || dto.withSender;

    const originalSender: UserDocument =
      forwardSender &&
      (await this.usersService.findById(originalMessage.sender));

    const boxMessagePrototype: ChatBoxMessage = {
      ...originalMessage.toObject(),
      _id: uuid(),
      chat: targetChat._id,
      forwardFrom: {
        _id,
        messaging: originalMessaging._id,
        messagingTitle: originalMessaging.title,
        sender: originalSender?._id,
        senderTitle:
          (originalSender &&
            [
              originalSender?.userAccount?.firstName,
              originalSender?.userAccount?.lastName,
            ].join(' ')) ||
          undefined,
      },
      sender: clientSocket.decodedToken.user.id,
      sentAt: new Date(),
      status: ChatMessageStatusEnum.SENT,
      type: 'box',
    };

    return boxMessagePrototype;
  }

  private async createForwardTextMessage(
    originalMessage: ChatTextMessageDocument,
    clientSocket: SocketWithToken,
    dto: ForwardMessageWsRequestDto,
    targetChat: AbstractMessagingDocument,
    _id: string,
  ): Promise<ChatTextMessage> {
    const originalMessaging: AbstractMessagingDocument =
      await this.commonMessagingService.findById(originalMessage.chat);

    await this.denyAccessUnlessGranted(
      VoteCodes.READ_MESSAGING,
      originalMessaging,
      { userToken: clientSocket.decodedToken.user },
    );

    const forwardSender: boolean = !('withSender' in dto) || dto.withSender;

    const originalSender: UserDocument =
      forwardSender &&
      (await this.usersService.findById(originalMessage.sender));

    const decodedContent: string = await Encryption.decryptWithSalt(
      originalMessage.content,
      originalMessaging.salt,
    );

    const textMessagePrototype: ChatTextMessage = {
      attachments: [],
      ...originalMessage.toObject(),
      _id: uuid(),
      chat: targetChat._id,
      content: await Encryption.encryptWithSalt(
        decodedContent,
        targetChat.salt,
      ),
      forwardFrom: {
        _id,
        messaging: originalMessaging._id,
        messagingTitle: originalMessaging.title,
        sender: originalSender?._id,
        senderTitle:
          (originalSender &&
            [
              originalSender?.userAccount?.firstName,
              originalSender?.userAccount?.lastName,
            ].join(' ')) ||
          undefined,
      },
      sender: clientSocket.decodedToken.user.id,
      sentAt: new Date(),
      status: ChatMessageStatusEnum.SENT,
      type: 'text',
    };
    const messageWithoutReplyTo: ChatTextMessage = this.removeReplyToFromForwardMessage(textMessagePrototype);

    return messageWithoutReplyTo;
  }

  private removeReplyToFromForwardMessage(message: ChatTextMessage): ChatTextMessage {
    const messageWithoutReplyTo: ChatTextMessage = { ...message };
    delete messageWithoutReplyTo.replyTo;
    delete messageWithoutReplyTo.replyToContent;

    return messageWithoutReplyTo;
  }

}
