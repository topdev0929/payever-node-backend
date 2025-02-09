import { v4 as uuid } from 'uuid';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, DocumentDefinition, FilterQuery, UpdateQuery, Query, QueryCursor } from 'mongoose';
import { EventDispatcher, UserTokenInterface } from '@pe/nest-kit';
import { ChatMessageStatusEnum } from '@pe/message-kit';
import { EventMessageTypeEnum, EventOriginEnum } from '../../../enums';
import {
  AbstractChatMessageDocument,
  AbstractChatMessage,
  ChatMessageStatusTransitionMap,
  ChatTextMessage,
  AbstractChatMessageEmbeddedDocument,
  DecryptedAbstractChatMessageInterface,
  AbstractMessagingDocument,
} from '../schemas';
import { InternalEventCodesEnum } from '../../../../common';
import { CHAT_MAX_LAST_MESSAGES } from '../const';
import { ChatEventMessage } from '../schemas/message/event';
import { ChatOnlineMembersService } from './chat-online-members.service';
import { StompService } from '@pe/stomp-client';
import { MessageHttpResponseDto, PinMessageDto } from '../../../dto';
import { StompTopicsEnum } from '../../../../consumer/enums';
import { MessageModelDbOperationDto } from '../../../dto/message-db-writer';
import { MessagesRedisService } from './messages-redis.service';
import { CommonMessagingService } from './common-messaging.service';
import { plainToClass } from 'class-transformer';

const UPDATE_ONE = 'update-one';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectModel(AbstractChatMessage.name)
    private readonly chatMessageModel: Model<AbstractChatMessageDocument>,
    private readonly commonMessagingService: CommonMessagingService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly onlineMembersService: ChatOnlineMembersService,
    private readonly stompService: StompService,
    private readonly messageRedisService: MessagesRedisService,
  ) { }

  public async create<T extends DocumentDefinition<AbstractChatMessageDocument>>(
    messagePrototypes: T[],
    eventSource: EventOriginEnum,
  ): Promise<T[]> {

    if (messagePrototypes.length === 0) {
      return [];
    }
    if (messagePrototypes.some((proto: T) => proto.chat !== messagePrototypes[0].chat)) {
      throw new BadRequestException(`Every created message should belongs to same chat`);
    }

    messagePrototypes.forEach((item: T) => {
      const messageId: string = item._id || item.id || uuid();
      item._id = item.id = messageId;
    });


    messagePrototypes = await Promise.all(messagePrototypes.map(async (message: T) => {
      const messageDbOperationDto: MessageModelDbOperationDto = { operation: 'create', createModel: message };

      await this.messageRedisService.onDbOperationCreated('create', message);
      this.stompService.publishJson(StompTopicsEnum.MessageMessageModelDbOperation, messageDbOperationDto);

      return message;
    }));

    const newMessages: AbstractChatMessageDocument[] = messagePrototypes.map((m: T) => {
      const document: AbstractChatMessageDocument = { ...m } as any;
      document.toObject = () => m;

      return document;
    });
    await this.populateObjects(newMessages);
    await this.eventDispatcher.dispatch(InternalEventCodesEnum.MessagesCreated, newMessages, eventSource);

    return messagePrototypes;
  }

  public async findById(_id: string): Promise<AbstractChatMessageDocument> {
    return (await this.messageRedisService.getMessageById(_id)) || (this.chatMessageModel.findById(_id));
  }

  public findOne(
    filter: FilterQuery<AbstractChatMessageDocument>,
  ): Query<AbstractChatMessageDocument, AbstractChatMessageDocument> {
    return this.chatMessageModel.findOne(filter);
  }

  public find(
    filter: FilterQuery<AbstractChatMessageDocument>,
  ): Query<AbstractChatMessageDocument[], AbstractChatMessageDocument> {
    return this.chatMessageModel.find({
      ...filter,
      status: {
        $ne: ChatMessageStatusEnum.DELETED,
      },
    });
  }

  public getStream(
    filter: FilterQuery<AbstractChatMessageDocument>,
  ): QueryCursor<AbstractChatMessageDocument> {
    return this.chatMessageModel
      .find(filter)
      .sort({
        createdAt: -1,
      })
      .cursor({
        batchSize: CHAT_MAX_LAST_MESSAGES,
      });
  }

  public async markAsRead(
    messages: AbstractChatMessageDocument[],
    readByUser: string,
    eventSource: EventOriginEnum,
  ): Promise<AbstractChatMessageDocument[]> {



    const updatedMessages: AbstractChatMessageDocument[] =
      await Promise.all(messages.map((message: AbstractChatMessageDocument) =>
        this.prepareMessageForDb(message, readByUser)));

    await this.eventDispatcher.dispatch(InternalEventCodesEnum.MessageUpdated, updatedMessages, eventSource);

    return updatedMessages;
  }

  public async markAsReadWithList(
    messages: AbstractChatMessageDocument[],
    readByUser: string,
    eventSource: EventOriginEnum,
  ): Promise<AbstractChatMessageDocument[]> {
    const updatedMessages: AbstractChatMessageDocument[] =
      await Promise.all(messages.map((message: AbstractChatMessageDocument) =>
        this.prepareMessageForDb(message, readByUser)));

    await this.eventDispatcher.dispatch(InternalEventCodesEnum.MessageListUpdated, updatedMessages, eventSource);

    return updatedMessages;
  }

  public async prepareMessageForDb(
    message: AbstractChatMessageDocument,
    readByUser: string,
  ): Promise<AbstractChatMessageDocument> {
    if (message && message.sender === readByUser) {
      return message;
    }
    const markReadDbOperation: MessageModelDbOperationDto = {
      filter: {
        _id: message._id,
        type: message.type,
      },
      operation: UPDATE_ONE,
      updateQuery:
      {
        $addToSet: {
          readBy: readByUser,
        },
        $set: {
          status: ChatMessageStatusEnum.READ,
        },
      },
    };

    const updatedMessage: AbstractChatMessageDocument = {
      ...(message.toObject ? message.toObject() : message),
      readBy: [
        ...message.readBy || [],
        readByUser,
      ],
      status: ChatMessageStatusEnum.READ,
      toObject: null,
    } as any;

    updatedMessage.toObject = () => updatedMessage;
    await this.messageRedisService.onDbOperationCreated('update', updatedMessage);
    this.stompService.publishJson(StompTopicsEnum.MessageMessageModelDbOperation, markReadDbOperation);

    await this.populateObjects([updatedMessage]);

    return updatedMessage;
  }

  public async markUnread(
    message: AbstractChatMessageDocument,
    readByUser: string,
    eventSource: EventOriginEnum,
  ): Promise<AbstractChatMessageDocument> {
    if (message.sender === readByUser) {
      return message;
    }
    const markReadDbOperation: MessageModelDbOperationDto = {
      filter: {
        _id: message._id,
        type: message.type,
      },
      operation: UPDATE_ONE,
      updateQuery:
      {
        $pull: {
          readBy: readByUser,
        },
      },
    };

    const updatedMessage: AbstractChatMessageDocument = {
      ...(message.toObject ? message.toObject() : message),
      readBy: message.readBy?.filter((id: string) => id !== readByUser) || [],
      toObject: null,
    } as any;

    updatedMessage.toObject = () => updatedMessage;
    await this.messageRedisService.onDbOperationCreated('update', updatedMessage);
    this.stompService.publishJson(StompTopicsEnum.MessageMessageModelDbOperation, markReadDbOperation);

    await this.populateObjects([updatedMessage]);
    await this.eventDispatcher.dispatch(InternalEventCodesEnum.MessageUpdated, [updatedMessage], eventSource);

    return updatedMessage;
  }

  public async update(
    data: { _id: string; $set: any },
    eventSource: EventOriginEnum,
  ): Promise<AbstractChatMessageDocument> {

    const existingMessage: AbstractChatMessageDocument = await this.findById(data._id);

    if (!existingMessage) {
      throw new NotFoundException(`Message with _id "${data._id}" not found`);
    }

    if (
      data.$set?.status &&
      existingMessage.status &&
      !ChatMessageStatusTransitionMap[existingMessage.status].includes(data.$set?.status)
    ) {
      throw new BadRequestException(
        `Message status cannot be transited from "${existingMessage.status}" to "${data.$set.status}"`
      );
    }

    const $set: any = { ...data.$set, editedAt: new Date() };
    const updatedMessage: AbstractChatMessageDocument = { ...existingMessage.toObject(), ...$set };
    updatedMessage.toObject = () => updatedMessage;

    const messageDbOperationDto: MessageModelDbOperationDto = {
      filter: {
        _id: data._id,
        type: existingMessage.type,
      },
      operation: UPDATE_ONE,
      updateQuery: {
        $set,
      },
    };

    const messageDbOperationDtoForReply: MessageModelDbOperationDto = data.$set.content ? {
      filter: {
        replyTo: data._id,
        type: existingMessage.type,
      },
      operation: 'update-many',
      updateQuery: {
        $set: { replyToContent: data.$set.content },
      },
    } : null;

    await this.messageRedisService.onDbOperationCreated('update', updatedMessage);
    this.stompService.publishJson(StompTopicsEnum.MessageMessageModelDbOperation, messageDbOperationDto);
    if (messageDbOperationDtoForReply) {
      this.stompService.publishJson(StompTopicsEnum.MessageMessageModelDbOperation, messageDbOperationDtoForReply);
    }

    await this.populateObjects([updatedMessage]);
    await this.eventDispatcher.dispatch(InternalEventCodesEnum.MessageUpdated, [updatedMessage], eventSource);

    return updatedMessage;
  }

  public async updateOrCreate(
    query: FilterQuery<AbstractChatMessageDocument>,
    updateData: UpdateQuery<AbstractChatMessageDocument>,
    upsertData: DocumentDefinition<AbstractChatMessageDocument>,
    eventSource: EventOriginEnum,
  ): Promise<Array<DocumentDefinition<AbstractChatMessageDocument>>> {
    const existing: AbstractChatMessageDocument = await this.findOne(query).exec();

    return existing ? [await this.update({
      $set: updateData,
      _id: existing._id,
    }, eventSource)] : this.create([upsertData], eventSource);
  }

  public async hardDeleteAllByMessagingId(abstractMessagingId: string): Promise<void> {
    await this.chatMessageModel.deleteMany({ chat: abstractMessagingId });
  }

  public async deleteForMe(
    _ids: string[],
    eventSource: EventOriginEnum,
    user?: UserTokenInterface,
  ): Promise<void> {

    const updatedMessages: any[] = [];
    for (const _id of _ids) {
      const existingMessage: AbstractChatMessageDocument = await this.findById(_id);
      if (!existingMessage) {
        throw new NotFoundException(`message with id: ${_id} does not exist.`);
      }

      if ((existingMessage.toObject() as ChatTextMessage).deletedForUsers?.some((id: string) => id === user.id)) {
        throw new BadRequestException(`Chat message with _id ${_id} already is deleted for user ${user.id}`);
      }

      const messageDbOperationDto: MessageModelDbOperationDto = {
        filter: {
          _id,
          type: existingMessage.type,
        },
        operation: UPDATE_ONE,
        updateQuery: {
          $push: { deletedForUsers: user.id },
        },
      };
      const updatedMessage: any = {
        ...existingMessage.toObject(),
        deletedForUsers: [
          ...(existingMessage.deletedForUsers || []),
          user.id,
        ],
        toObject: null,
      };

      updatedMessage.toObject = () => updatedMessage;
      await this.messageRedisService.onDbOperationCreated('update', updatedMessage);
      this.stompService.publishJson(StompTopicsEnum.MessageMessageModelDbOperation, messageDbOperationDto);
      updatedMessages.push(updatedMessage);
    }

    if (updatedMessages.length > 0) {
      await this.eventDispatcher.dispatch(
        InternalEventCodesEnum.MessageListUpdated,
        updatedMessages,
        eventSource,
      );
    }
  }

  public async deleteForEveryone(
    _ids: string[],
    eventSource: EventOriginEnum,
  ): Promise<void> {

    const messages: AbstractChatMessageDocument[] = [];
    for (const _id of _ids) {
      const existingMessage: AbstractChatMessageDocument = await this.findById(_id);
      if (!existingMessage) {
        throw new NotFoundException(`message with id: ${_id} does not exist.`);
      }

      const messageDbOperationDto: MessageModelDbOperationDto = {
        filter: {
          _id,
          type: existingMessage.type,
        },
        operation: UPDATE_ONE,
        updateQuery: {
          $set: {
            status: ChatMessageStatusEnum.DELETED,
          },
        },
      };
      existingMessage.status = ChatMessageStatusEnum.DELETED;
      await this.messageRedisService.onDbOperationCreated('update', existingMessage);
      this.stompService.publishJson(StompTopicsEnum.MessageMessageModelDbOperation, messageDbOperationDto);

      await this.commonMessagingService.unpinMessageByMessageId(
        existingMessage.chat,
        existingMessage._id,
        eventSource,
      );
      messages.push(existingMessage);
    }

    if (messages.length > 0) {
      await this.eventDispatcher.dispatch(
        InternalEventCodesEnum.MessageListDeleted,
        messages,
        eventSource,
      );
    }
  }

  public async delete(
    _id: string,
    eventSource: EventOriginEnum,
    user?: UserTokenInterface,
  ): Promise<void> {
    const existingMessage: AbstractChatMessageDocument = await this.findById(_id);

    if (!existingMessage) {
      throw new NotFoundException(`message with id: ${_id} does not exist.`);
    }

    if (user) {
      if ((existingMessage.toObject() as ChatTextMessage).deletedForUsers?.some((id: string) => id === user.id)) {
        throw new BadRequestException(`Chat message with _id ${_id} already is deleted for user ${user.id}`);
      }

      const messageDbOperationDto: MessageModelDbOperationDto = {
        filter: {
          _id,
          type: existingMessage.type,
        },
        operation: UPDATE_ONE,
        updateQuery: {
          $push: { deletedForUsers: user.id },
        },
      };
      const updatedMessage: any = {
        ...existingMessage.toObject(),
        deletedForUsers: [
          ...(existingMessage.deletedForUsers || []),
          user.id,
        ],
        toObject: null,
      };
      updatedMessage.toObject = () => updatedMessage;
      await this.messageRedisService.onDbOperationCreated('update', updatedMessage);
      this.stompService.publishJson(StompTopicsEnum.MessageMessageModelDbOperation, messageDbOperationDto);

      await this.eventDispatcher.dispatch(
        InternalEventCodesEnum.MessageUpdated,
        [updatedMessage],
        eventSource,
      );
    } else {
      const messageDbOperationDto: MessageModelDbOperationDto = {
        filter: {
          _id,
          type: existingMessage.type,
        },
        operation: UPDATE_ONE,
        updateQuery: {
          $set: {
            status: ChatMessageStatusEnum.DELETED,
          },
        },
      };
      existingMessage.status = ChatMessageStatusEnum.DELETED;
      await this.messageRedisService.onDbOperationCreated('update', existingMessage);
      this.stompService.publishJson(StompTopicsEnum.MessageMessageModelDbOperation, messageDbOperationDto);

      await this.commonMessagingService.unpinMessageByMessageId(
        existingMessage.chat,
        existingMessage._id,
        eventSource,
      );

      await this.eventDispatcher.dispatch(
        InternalEventCodesEnum.MessageDeleted,
        [existingMessage],
        eventSource,
      );
    }
  }

  //  FIXME: If clear was called more then once. It will emit event for all previously deleted messeges too
  public async deleteChatHistory(
    _id: string,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    await this.chatMessageModel.updateMany(
      {
        chat: _id,
      },
      {
        $set: {
          status: ChatMessageStatusEnum.DELETED,
        },
      },
    ).exec();
    const deletedMessages: AbstractChatMessageDocument[] = await this.chatMessageModel.find({
      chat: _id,
      status: ChatMessageStatusEnum.DELETED,
    }).exec();

    await this.eventDispatcher.dispatch(
      InternalEventCodesEnum.MessageDeleted,
      deletedMessages,
      eventSource,
    );
  }

  public async populateObjects(messages:
    AbstractChatMessageDocument[] |
    MessageHttpResponseDto[] |
    Array<DocumentDefinition<AbstractChatMessageDocument>>,
  ): Promise<void> {
    if (!messages) {
      return;
    }

    for (const message of messages) {

      if (!ChatEventMessage.isTypeOf(message)) {
        continue;
      }

      const eventName: string = message.eventName;
      const data: any = message.data || { };

      if (eventName === EventMessageTypeEnum.ExcludeMember) {
        data.excludedBy = await this.onlineMembersService.getMember(data.excludedById, null);
        data.excludedUser = await this.onlineMembersService.getMember(data.excludedUserId, null);
      } else if (eventName === EventMessageTypeEnum.IncludeMember) {
        data.includedBy = await this.onlineMembersService.getMember(data.includedById, null);
        data.includedUser = await this.onlineMembersService.getMember(data.includedUserId, null);
      } else if (eventName === EventMessageTypeEnum.LeaveChat) {
        data.leftUser = await this.onlineMembersService.getMember(data.leftUserId, null);
      }

      message.data = data;
    }
  }

  public async getUnreadMessagesCount(
    userId: string,
    chatId: string,
    from: Date = null,
  ): Promise<string> {
    let count: number = await this.chatMessageModel.count({
      chat: chatId,
      deletedForUsers: { $ne: userId },
      readBy: { $ne: userId },
      sender: { $ne: userId },
      ...from ? { sentAt: { $gte: from } } : null,
      status: { $ne: ChatMessageStatusEnum.DELETED },
      type: 'text',
    }).limit(100);

    const cachedMessages: any[] = await this.messageRedisService.getLastCreatedChatMessages(chatId, 100);
    const cachedCount: number = cachedMessages.filter((message: AbstractChatMessageEmbeddedDocument) => {
      if (message.sender === userId) {
        return false;
      }

      if (message.status === ChatMessageStatusEnum.DELETED) {
        return false;
      }

      if (message.readBy && message.readBy.some((id: string) => id === userId)) {
        return false;
      }

      if (message.deletedForUsers && message.deletedForUsers.some((id: string) => id === userId)) {
        return false;
      }

      if (message.type !== 'text') {
        return false;
      }

      return !(from && message.sentAt < from);
    }).length;
    count += cachedCount;

    return count < 100 ? String(count) : '99+';
  }

  public async getReplyContent(replyId: string): Promise<string | null> {
    try {
      const originalReplyMessage: AbstractChatMessageDocument = await this.findById(replyId);

      return (originalReplyMessage as any).content ? (originalReplyMessage as any).content : null;
    } catch (error) {

      return null;
    }

  }

  public async getReplyData(replyId: string): Promise<AbstractChatMessageDocument> {
    try {
      return this.findById(replyId);
    } catch (error) {

      return null;
    }

  }

  public async pinMessage(
    dto: PinMessageDto,
  ): Promise<void> {

    const message : AbstractChatMessageDocument = await this.findById(dto.messageId);
    const chatObj : AbstractMessagingDocument = await this.commonMessagingService.findById(dto.chat);
    const decryptedMessage: DecryptedAbstractChatMessageInterface =
      await this.commonMessagingService.decryptMessage(message, chatObj.salt);

    const messageHttpResponseDto: MessageHttpResponseDto = plainToClass(MessageHttpResponseDto, decryptedMessage);

    await this.commonMessagingService.pinMessage(
      dto.chat,
      {
        _id: dto._id ?? uuid(),
        forAllUsers: dto.forAllUsers,
        messageId: dto.messageId,
        notifyAllMembers: dto.notifyAllMembers,
        pinner: dto.sender,
      },
      EventOriginEnum.MerchantHttpServer,
      messageHttpResponseDto,
    );

  }

  public async unpinMessage(
    dto: PinMessageDto,
  ): Promise<void> {

    await this.commonMessagingService.unpinMessageByMessageId(
      dto.chat,
      dto.messageId,
      EventOriginEnum.MerchantHttpServer,
    );

  }


}
