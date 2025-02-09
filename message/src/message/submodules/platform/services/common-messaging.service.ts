import * as crypto from 'crypto';
import { mapKeys, Dictionary } from 'lodash';
import { Model, FilterQuery, Query, LeanDocument } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Inject, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ChatMemberRoleEnum, ChatMessageStatusEnum } from '@pe/message-kit';
import { Encryption, EventDispatcher } from '@pe/nest-kit';
import { DiscoveredClassWithMeta, DiscoveryService } from '@pe/nest-kit/modules/discovery';
import { EventOriginEnum, AddMemberMethodEnum, ExcludeMemberTypeEnum } from '../../../enums';
import { BaseMessagingService } from './base.messaging-service';
import { CHAT_MAX_LAST_MESSAGES } from '../const';
import {
  AbstractMessaging,
  AbstractMessagingDocument,
  AbstractChatMessage,
  AbstractChatMessageDocument,
  ChatMember,
  ChatTextMessage,
  MemberPermissions,
  DecryptedAbstractChatMessageInterface,
  DecryptedChatTextMessageInterface,
  AbstractChatMessageEmbeddedDocument,
  ChatInvitedMember,
} from '../schemas';
import { InternalEventCodesEnum } from '../../../../common';
import { MESSAGING_TYPE_SERVICE_TAG } from '../decorators';
import { GetMessagingFilterContextInterface, GetMessagingMembersFilterContextInterface } from '../../../interfaces';
import { UserDocument } from '../../../../projections/models';
import { Pinned, PinnedEmbeddedDocument } from '../schemas/pinned.schema';
import { UsersService } from '../../../../projections';
import { MessageHttpResponseDto } from '../../../dto';
import { EsFolderItemInterface, FolderDocumentsResultsDto, FoldersEventsEnum, ListQueryDto } from '@pe/folders-plugin';
import { MessagesRedisService } from './messages-redis.service';
import { GuestUserInterface } from '../interfaces';
import { StompService } from '@pe/stomp-client';
import { StompTopicsEnum } from '../../../../consumer/enums';
import { ChatSyncDto } from 'src/http/dto/outgoing/chat-sync.dto';

export class CommonMessagingService {
  @Inject() protected readonly eventDispatcher: EventDispatcher;

  private readonly messagingServices: Array<BaseMessagingService<AbstractMessagingDocument>> = [];
  constructor(
    @InjectModel(AbstractMessaging.name)
    private readonly model: Model<AbstractMessagingDocument>,
    private readonly userService: UsersService,
    private readonly discoveryService: DiscoveryService,
    private readonly messageRedisService: MessagesRedisService,
    private readonly stompService: StompService,
  ) { }

  public async onModuleInit(): Promise<void> {
    const messagingTypes: Array<DiscoveredClassWithMeta<true>> =
      await this.discoveryService.providersWithMetaAtKey(MESSAGING_TYPE_SERVICE_TAG);

    for (const item of messagingTypes) {
      this.messagingServices.push(
        item.discoveredClass.instance as unknown as BaseMessagingService<AbstractMessagingDocument>,
      );
    }
  }

  public async findById(_id: string): Promise<AbstractMessagingDocument> {
    return this.model.findById(_id);
  }

  public async findOne(filter: FilterQuery<AbstractMessagingDocument>): Promise<AbstractMessagingDocument> {
    return this.model.findOne(filter);
  }

  public find(
    filter: FilterQuery<AbstractMessagingDocument>,
  ): Query<AbstractMessagingDocument[], AbstractMessagingDocument> {
    return this.model.find(filter);
  }

  public async hardDelete(
    _id: string,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    await this.delete(_id, eventSource);
    await this.model.findByIdAndDelete(_id);
    await this.eventDispatcher.dispatch(InternalEventCodesEnum.ChatHardDeleted, { _id }, eventSource);
  }

  public async delete(
    _id: string,
    eventSource: EventOriginEnum,
  ): Promise<AbstractMessagingDocument> {

    const deletedMessaging: AbstractMessagingDocument = await this.model.findByIdAndUpdate(_id, {
      deleted: true,
    }, {
      new: true,
    }).exec();
    if (!deletedMessaging) {
      throw new NotFoundException(`Chat with _id '${_id}' not found`);
    }

    await this.eventDispatcher.dispatch(InternalEventCodesEnum.ChatDeleted, deletedMessaging, eventSource);

    return deletedMessaging;
  }

  public containMember(
    chat: AbstractMessagingDocument,
    userId: string,
  ): boolean {
    return chat.members.some((member: ChatMember) => member.user === userId);
  }

  public async tryAddMemberByEmail(
    chat: AbstractMessagingDocument,
    email: string,
    addedBy: string,
  ): Promise<UserDocument> {
    const existingUser: UserDocument = await this.userService.findOne({ 'userAccount.email': email });
    if (!existingUser) {
      return null;
    }

    if (chat.members && chat.members.some((m: any) => m.user === existingUser._id)) {
      throw new BadRequestException(`chat already had member with userId: ${existingUser._id}`);
    }

    await this.addMember(
      chat,
      existingUser,
      {
        addMethod: AddMemberMethodEnum.INVITE,
        addedBy,
        role: ChatMemberRoleEnum.Member,
        withInvitationLink: false,
      },
    );

    return existingUser;
  }

  public async addMember(
    originalChat: AbstractMessagingDocument,
    user: UserDocument,
    dto: {
      addMethod: AddMemberMethodEnum;
      addedBy: string;
      role: ChatMemberRoleEnum;
      withInvitationLink: boolean;
    },
  ): Promise<AbstractMessagingDocument> {
    const elemToMove: ChatMember =
      originalChat.removedMembers?.find((member: ChatMember) => member.user === user._id);

    if (this.containMember(originalChat, user._id)) {
      throw new BadRequestException(`User ${user._id} already exists in chat ${originalChat._id}`);
    }

    elemToMove && await this.model.updateOne({
      _id: originalChat._id,
      removedMembers: {
        $elemMatch: elemToMove,
      },
    }, {
      $pull: {
        removedMembers: elemToMove,
      },
    }).exec();

    const memberToAdd: ChatMember = {
      addMethod: dto.addMethod,
      addedBy: dto.addedBy,
      addedByInvitationLink: dto.withInvitationLink,
      role: dto?.role || ChatMemberRoleEnum.Member,
      user: user._id,

      permissions: {
        sendMedia: originalChat?.permissions ? originalChat.permissions.sendMedia : true,
        sendMessages: originalChat?.permissions ? originalChat.permissions.sendMessages : true,
      },
    };
    const updatedChat: AbstractMessagingDocument = await this.model.findByIdAndUpdate(originalChat._id, {
      $addToSet: {
        members: memberToAdd,
      },
    }, {
      new: true,
    }).exec();

    await this.removeInvitedMember(originalChat, { email: user.userAccount?.email });
    await this.eventDispatcher.dispatch(InternalEventCodesEnum.MemberIncluded, updatedChat, user, memberToAdd);

    return updatedChat;
  }

  public async addGuestMember(
    originalChat: AbstractMessagingDocument,
    guestUser: GuestUserInterface,
    dto: {
      addMethod: AddMemberMethodEnum;
      addedBy: string;
      role: ChatMemberRoleEnum;
      withInvitationLink: boolean;
    },
  ): Promise<AbstractMessagingDocument> {
    const memberToAdd: ChatMember = {
      addMethod: dto.addMethod,
      addedBy: dto.addedBy,
      addedByInvitationLink: dto.withInvitationLink,
      guestUser,
      permissions: {
        sendMedia: originalChat?.permissions ? originalChat.permissions.sendMedia : true,
        sendMessages: originalChat?.permissions ? originalChat.permissions.sendMessages : true,
      },
      role: dto?.role || ChatMemberRoleEnum.Member,
      user: null,
    };
    const updatedChat: AbstractMessagingDocument = await this.model.findByIdAndUpdate(originalChat._id, {
      $addToSet: {
        members: memberToAdd,
      },
    }, {
      new: true,
    }).exec();

    await this.eventDispatcher.dispatch(InternalEventCodesEnum.MemberIncluded,
      updatedChat,
      null,
      memberToAdd
    );

    return updatedChat;
  }

  public async updateMember(
    originalChat: AbstractMessaging,
    userToUpdate: UserDocument,
    dto: {
      role: ChatMemberRoleEnum;
      permissions: Partial<MemberPermissions>;
    },
  ): Promise<void> {
    const permissionsUpdateDate: Dictionary<boolean> = mapKeys(
      dto.permissions || { },
      (value: boolean, key: string) => `members.$.permissions.${key}`,
    );

    await this.model.updateOne(
      {
        _id: originalChat._id,
        'members.user': userToUpdate._id,
      },
      {
        $set: {
          ...permissionsUpdateDate,
          'members.$.role': dto.role,
        },
      },
    );

    const updatedChat: AbstractMessagingDocument = await this.model.findById(originalChat._id);

    await this.eventDispatcher.dispatch(
      InternalEventCodesEnum.MemberChanged,
      updatedChat,
      userToUpdate,
      updatedChat.members.find((member: ChatMember) => member.user === userToUpdate._id),
    );
  }

  public async removeMember(
    originalChat: AbstractMessagingDocument,
    userToExclude: UserDocument,
    dto: {
      removedBy: string;
    },
  ): Promise<AbstractMessagingDocument> {
    const elemToMove: ChatMember = originalChat.members?.find(
      (item: ChatMember) => item.user === userToExclude._id,
    );
    if (!elemToMove) {
      throw new BadRequestException(`Member '${userToExclude._id}' is not member of chat '${originalChat._id}'`);
    }

    elemToMove.removedBy = dto.removedBy;
    await this.model.updateOne({
      _id: originalChat._id,
    }, {
      $pull: {
        members: { user: userToExclude._id },
      },
      $push: {
        removedMembers: elemToMove,
      },
    }).exec();

    const updatedChat: AbstractMessagingDocument = await this.model.findById(originalChat._id).exec();
    await this.eventDispatcher.dispatch(InternalEventCodesEnum.MemberExcluded, updatedChat, userToExclude, elemToMove);

    return updatedChat;
  }

  public async excludeMemberFromChat(
    originalChat: AbstractMessagingDocument,
    userToLeaveId: string,
    excludeType: ExcludeMemberTypeEnum,
  ): Promise<AbstractMessagingDocument> {
    const elemToMove: ChatMember = originalChat.members?.find(
      (item: ChatMember) => item.user === userToLeaveId,
    );
    if (!elemToMove) {
      throw new BadRequestException(`Member '${userToLeaveId}' is not member of chat '${originalChat._id}'`);
    }

    elemToMove.hasLeft = true;
    await this.model.updateOne({
      _id: originalChat._id,
    }, {
      $pull: {
        members: { user: userToLeaveId },
      },
      $push: {
        removedMembers: elemToMove,
      },
    }).exec();

    const updatedChat: AbstractMessagingDocument = await this.model.findById(originalChat._id).exec();
    const userToLeave: UserDocument = await this.userService.findById(userToLeaveId);
    const eventName: string = excludeType === ExcludeMemberTypeEnum.excluded ?
      InternalEventCodesEnum.MemberExcluded :
      InternalEventCodesEnum.MemberLeft;
    await this.eventDispatcher.dispatch(eventName, updatedChat, userToLeave, elemToMove);

    return updatedChat;
  }

  public async purgeMember(
    originalChat: AbstractMessagingDocument,
    userToPurge: UserDocument,
  ): Promise<AbstractMessagingDocument> {
    const elemToPurge: ChatMember = originalChat.members?.find(
      (item: ChatMember) => item.user === userToPurge._id,
    );
    if (!elemToPurge) {
      throw new BadRequestException(`Member '${userToPurge._id}' is not member of chat '${originalChat._id}'`);
    }
    const chat: AbstractMessagingDocument = await this.model.findByIdAndUpdate(originalChat._id, {
      $pull: {
        members: {
          user: userToPurge._id,
        },
      },
    }, {
      new: true,
    }).exec();

    await this.eventDispatcher.dispatch(InternalEventCodesEnum.MemberExcluded, chat, userToPurge, elemToPurge);

    return chat;
  }

  public async addLastMessage(
    message: AbstractChatMessageDocument,
  ): Promise<void> {
    await this.model.findByIdAndUpdate(message.chat, {
      $push: {
        lastMessages: {
          $each: [message],
          $slice: -CHAT_MAX_LAST_MESSAGES,
        },
      },
    }).exec();
  }

  public async replaceLastMessage(
    message: AbstractChatMessageDocument,
  ): Promise<void> {
    type SetObject = {
      [key: string]: any;
    };
    const $setObject: SetObject = Object.entries(message.toObject()).reduce((acc: SetObject, curr: [string, any]) => {
      // tslint:disable-next-line: typedef
      const [key, value]: [string, any] = curr;
      acc[`lastMessages.$.${key}`] = value;

      return acc;
    }, { } as SetObject);

    await this.model.findOneAndUpdate({
      _id: message.chat,
      lastMessages: {
        $elemMatch: {
          _id: message._id,
          type: message.type,
        },
      },
    }, {
      $set: $setObject,
    }, {
      new: true,
    }).exec();
  }

  public async deleteLastMessage(
    chat: AbstractMessagingDocument,
    message: AbstractChatMessageDocument,
  ): Promise<void> {
    await this.model.findByIdAndUpdate(chat._id, {
      $pull: {
        lastMessages: {
          _id: message._id,
        },
      },
    }).exec();
  }

  public async updateMemberNotification(
    chatId: string,
    userId: string,
    until: Date,
  ): Promise<AbstractMessagingDocument> {
    const chat: AbstractMessagingDocument = await this.model.findById(chatId).exec();

    if (!this.containMember(chat, userId)) {
      throw new ForbiddenException(`You are not a member of chat ${chat._id}`);
    }

    await this.model.updateOne({
      _id: chatId,
      'members.user': userId,
    }, {
      $set: {
        'members.$.notificationDisabledUntil': until,
      },
    }).exec();

    const updatedChat: AbstractMessagingDocument = await this.model.findById(chatId).exec();

    await this.eventDispatcher.dispatch(
      InternalEventCodesEnum.ChatUpdated,
      updatedChat,
      EventOriginEnum.MerchantHttpServer,
    );

    return updatedChat;
  }

  public async pinMessage(
    chatId: string,
    pinned: Pinned,
    eventSource: EventOriginEnum,
    message: MessageHttpResponseDto,
  ): Promise<AbstractMessagingDocument> {
    const chatWithPinned: AbstractMessagingDocument = await this.model.findByIdAndUpdate(
      chatId,
      {
        $addToSet: {
          pinned,
        },
      },
      {
        new: true,
      },
    );

    await this.eventDispatcher.dispatch(
      InternalEventCodesEnum.MessagePinned,
      chatWithPinned,
      pinned,
      eventSource,
      message,
    );

    return chatWithPinned;
  }

  public async unpinMessageByMessageId(
    chatId: string,
    messageId: string,
    eventSource: EventOriginEnum,
  ): Promise<AbstractMessagingDocument> {
    const originalChat: AbstractMessagingDocument = await this.model.findById(chatId);
    const pinnedToDelete: Pinned[] = originalChat.pinned.filter((pinned: Pinned) => pinned.messageId === messageId);
    const chatWithUnpinned: AbstractMessagingDocument = await this.model.findByIdAndUpdate(
      chatId,
      {
        $pull: { pinned: { messageId } },
      },
      {
        new: true,
      },
    );

    await Promise.all(pinnedToDelete.map((pinned: Pinned) => this.eventDispatcher.dispatch(
      InternalEventCodesEnum.MessageUnpinned,
      chatWithUnpinned,
      pinned,
      eventSource,
    )));

    return chatWithUnpinned;
  }

  public async unpinMessage(
    chatId: string,
    pinnedId: string,
    eventSource: EventOriginEnum,
  ): Promise<AbstractMessagingDocument> {
    const originalChat: AbstractMessagingDocument = await this.model.findById(chatId);
    const pinnedToDelete: Pinned = originalChat.pinned.find((pinned: Pinned) => pinned._id === pinnedId);
    const chatWithUnpinned: AbstractMessagingDocument = await this.model.findByIdAndUpdate(
      chatId,
      {
        $pull: {
          pinned: {
            _id: pinnedId,
          },
        },
      },
      {
        new: true,
      },
    );

    await this.eventDispatcher.dispatch(
      InternalEventCodesEnum.MessageUnpinned,
      chatWithUnpinned,
      pinnedToDelete,
      eventSource,
    );

    return chatWithUnpinned;
  }

  public getRoomIdByChatId(
    chatId: string,
  ): string {
    return chatId;
  }

  public getRoomIdByBusinessId(
    businessId: string,
  ): string {
    return `service:business:${businessId}`;
  }

  public getRoomIdByUserId(
    userId: string,
  ): string {
    return `service:user:${userId}`;
  }

  public async decryptContent(content: string, salt: string, fallback: string = content): Promise<string> {
    try {
      return await Encryption.decryptWithSalt(content, salt);
    } catch (e) {
      return fallback;
    }
  }

  public async decryptMessagesWithSalt(
    messages: AbstractChatMessageDocument[],
    salt: string,
    fallback?: string,
  ): Promise<DecryptedAbstractChatMessageInterface[]> {
    return Promise.all(messages.map(
      (message: AbstractChatMessageDocument) => this.decryptMessage(message, salt, fallback)),
    );
  }

  public async decryptMessage(
    message: AbstractChatMessageDocument,
    salt: string,
    fallback?: string,
  ): Promise<DecryptedAbstractChatMessageInterface> {
    const originalMessageObj: any = (message.toObject ? message.toObject() : message);
    if (ChatTextMessage.isTypeOf(message)) {
      const content: string = message.content ?
        await this.decryptContent(message.content, salt, fallback || message?.content) : '';
      const replyToContent: string = message.replyToContent ?
        await this.decryptContent(message.replyToContent, salt, fallback || message?.replyToContent) : '';
      const contentType: string = message.contentType ?
        await this.decryptContent(message.contentType, salt, message?.contentType) : null;
      const contentPayloadJson: string = message.contentPayload;
      let contentPayload: any = null;
      try {
        contentPayload = contentPayloadJson ? JSON.parse(contentPayloadJson) : null;
      } catch (ex) {
        contentPayload = contentPayloadJson;
      }

      return {
        ...originalMessageObj,
        _decrypted: true,
        content,
        contentPayload,
        contentType,
        replyToContent,
      } as DecryptedChatTextMessageInterface;
    } else {
      return {
        ...originalMessageObj,
        _decrypted: true,
      };
    }
  }

  public async decryptChat<T extends AbstractMessagingDocument>(
    chat: T,
    fallback: string = '*NOT_DECRYPTED*',
  ): Promise<LeanDocument<T>> {
    const lastMessages: AbstractChatMessage[] =
      await Promise.all(
        chat.lastMessages.map(
          (message: AbstractChatMessageDocument) => this.decryptMessage(message, chat.salt, fallback),
        ),
      );

    const pinned: PinnedEmbeddedDocument[] = [];

    for (const message of chat.pinned) {
      if ((message.messageId as any)?._id) {
        message.message = await this.decryptMessage(message.messageId as any, chat.salt, fallback);
        message.messageId = message.message?._id;
      }
      pinned.push(message);
    }

    return {
      ...chat.toObject(),
      lastMessages,
      pinned,
    };
  }

  public createSalt(): string {
    return crypto.randomBytes(64 + 32).toString('base64');
  }

  public getMessagingFilter(context: GetMessagingFilterContextInterface): FilterQuery<AbstractMessagingDocument> {
    return {
      $or: this.messagingServices
        .map((m: BaseMessagingService<AbstractMessagingDocument>) => m.getMessagingFilter(context))
        .filter((filter: FilterQuery<AbstractMessagingDocument>) => filter),
    };
  }

  public getMessagingMembersFilter(context: GetMessagingMembersFilterContextInterface): FilterQuery<UserDocument> {
    return this.getServiceOf(context.chat).getMembersFilter(context);
  }

  public async getBusinessFolderItems(chatIds: string[], businessId: string): Promise<EsFolderItemInterface[]> {
    return this.getFolderItems(chatIds, businessId, null);
  }

  public async getUserFolderItems(chatIds: string[], userId: string): Promise<EsFolderItemInterface[]> {
    return this.getFolderItems(chatIds, null, userId);
  }

  public async removeInvitedMember(
    messaging: AbstractMessagingDocument,
    invitedMember: Partial<ChatInvitedMember>,
  ): Promise<void> {
    const pullObj: any = invitedMember._id ? { _id: invitedMember._id } :
      invitedMember.contactId ? { contactId: invitedMember.contactId } :
        invitedMember.email ? { email: invitedMember.email } : null;

    if (!pullObj) {
      return;
    }

    await this.model.updateOne(
      { _id: messaging._id },
      {
        $pull: {
          invitedMembers: pullObj,
        },
      });
  }

  public async addOrUpdateInvitedMember(
    messaging: AbstractMessagingDocument,
    invitedMember: Partial<ChatInvitedMember>,
  ): Promise<void> {
    await this.removeInvitedMember(messaging, invitedMember);
    await this.model.updateOne(
      { _id: messaging._id },
      {
        $push: {
          invitedMembers: invitedMember,
        },
      },
    );
  }

  public async fillCachedData(messaging: AbstractMessagingDocument, forUserId: string): Promise<void> {

    messaging.lastMessages = messaging.lastMessages || [];
    const cachedMessageIds: string[] =
      await this.messageRedisService.getLastCreatedChatMessageIds(messaging._id, 2 * CHAT_MAX_LAST_MESSAGES);
    if (!cachedMessageIds) {
      return;
    }


    const dbMessages: AbstractChatMessageEmbeddedDocument[] = messaging.lastMessages.filter(
      (m: AbstractChatMessageEmbeddedDocument) => !cachedMessageIds.some((cid: string) => cid === m._id));

    let messages: AbstractChatMessageEmbeddedDocument[] = await Promise.all([
      ...dbMessages.map((m: any) => m._id),
      ...cachedMessageIds,
    ].map((id: string) => {
      return new Promise<AbstractChatMessageEmbeddedDocument>((resolve: any, reject: any) => {
        this.messageRedisService.getMessageById(id).then((data: any) => {
          resolve(data || messaging.lastMessages.find((m: any) => m._id === id));
        }).catch((ex: any) => {
          reject(ex);
        });
      });
    }));

    messages = messages.filter((message: AbstractChatMessageEmbeddedDocument) => {
      if (!message || message.status === ChatMessageStatusEnum.DELETED) {
        return false;
      }

      return !(message.deletedForUsers && message.deletedForUsers.some((id: string) => id === forUserId));
    }).sort((a: AbstractChatMessageDocument, b: AbstractChatMessageDocument) =>
      new Date(a.sentAt) < new Date(b.sentAt) ? -1 : +1,
    );

    if (messages.length > CHAT_MAX_LAST_MESSAGES) {
      messages = messages.splice(messages.length - CHAT_MAX_LAST_MESSAGES, CHAT_MAX_LAST_MESSAGES);
    }

    messaging.lastMessages = messages;
  }

  private async getFolderItems(
    chatIds: string[],
    businessId: string,
    userId: string,
  ): Promise<EsFolderItemInterface[]> {
    const searchQuery: ListQueryDto = new ListQueryDto();
    searchQuery.limit = chatIds.length * 100;
    searchQuery.filters = { serviceEntityId: { condition: 'isIn', value: chatIds } };
    const folderQueryObject: FolderDocumentsResultsDto = {
      businessId,
      query: searchQuery,
      results: [],
      userId,
    };
    await this.eventDispatcher.dispatch(FoldersEventsEnum.GetAllPaginatedDocuments, folderQueryObject);

    return folderQueryObject.results;
  }

  private getServiceOf(chat: AbstractMessaging): BaseMessagingService<AbstractMessagingDocument> {
    return this.messagingServices.find(
      (service: BaseMessagingService<AbstractMessagingDocument>) => service.isServiceOf(chat),
    );
  }

  public syncChatDataToLiveSide(dto : ChatSyncDto) : void {
    this.stompService.publishJson(StompTopicsEnum.TpmChatSync, dto);
  }
}
