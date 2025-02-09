import { RedisClient, EventDispatcher } from '@pe/nest-kit';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../../projections/services';
import { UserDocument } from '../../../../projections/models';
import { ContactDocument } from '../model';
import { ChatOnlineMemberInterface } from '../../../schemas';
import { ContactsService } from './contacts.service';
import { InternalEventCodesEnum } from '../../../../common';
import { EventOriginEnum } from '../../../enums';
import * as moment from 'moment';



@Injectable()
export class ChatOnlineMembersService {
  constructor(
    private readonly redisClient: RedisClient,
    private readonly eventDispatcher: EventDispatcher,
    private readonly usersService: UsersService,
    private readonly contactsService: ContactsService,
  ) {
  }

  public async clearAllCacheData(): Promise<void> {
    await this.redisClient.deleteKeysByPattern('socket:*:joined-chats');
    await this.redisClient.deleteKeysByPattern('chat:*:online-members');
    await this.redisClient.deleteKeysByPattern('member:*:connections');
  }

  public async addOnlineMember(
    connectionId: string,
    chatId: string,
    userId: string,
    contactId: string,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    if (!connectionId && !userId && !contactId) {
      return;
    }
    const socketId: string = connectionId || userId || contactId;
    const socketChatKey: string = `socket:${socketId}:joined-chats`;
    const socketChatField: string = chatId;

    if (!await this.redisClient.getClient().hexists(socketChatKey, socketChatField)) {
      await this.redisClient.getClient().hset(socketChatKey, socketChatField, chatId);
    }

    await this.addMemberSocketId(userId || contactId, connectionId);

    const chatOnlineMembersKey: string = `chat:${chatId}:online-members`;

    const chatOnlineMembersField: string = socketId;
    if (!await this.redisClient.getClient().hexists(chatOnlineMembersKey, chatOnlineMembersField)) {
      const member: ChatOnlineMemberInterface = {
        ...(await this.getMember(userId, contactId)),
        connectionId,
        lastActivity: new Date(),
      };
      await this.redisClient.getClient().hset(chatOnlineMembersKey, chatOnlineMembersField, JSON.stringify(member));
      await this.emitOnlineMembersUpdated(chatId, eventSource);
    }
  }

  public async removeConnectionFromAllChats(
    connectionId: string,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    const chatIds: string[] = await this.getAllJoinedChatsIdsByConnection(connectionId);
    for (const chatId of chatIds) {
      await this.removeOnlineMember(connectionId, chatId, null, null, eventSource);
    }
  }

  public async removeOnlineMember(
    connectionId: string,
    chatId: string,
    userId: string,
    contactId: string,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    if (!connectionId && !userId && !contactId) {
      return;
    }
    const socketChatField: string = chatId;

    if (!connectionId && (userId || contactId)) { // remove based on userId or contactId
      const connectionIds: string[] = await this.getAllSocketIds(userId || contactId);
      for (const cid of connectionIds) {
        await this.redisClient.getClient().hdel(`socket:${cid}:joined-chats`, socketChatField);
        await this.redisClient.getClient().hdel(`chat:${chatId}:online-members`, cid);
      }
    } else {
      await this.redisClient.getClient().hdel(`socket:${connectionId}:joined-chats`, socketChatField);
      await this.redisClient.getClient().hdel(`chat:${chatId}:online-members`, connectionId);
    }

    await this.emitOnlineMembersUpdated(chatId, eventSource);
  }

  public async emitOnlineMembersUpdated(
    chatId: string,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    const onlineMembers: ChatOnlineMemberInterface[] = await this.getChatOnlineMembers(chatId);
    const onlineMembersCount: number = this.countOnlineMembers(onlineMembers);

    await this.eventDispatcher.dispatch(
      InternalEventCodesEnum.ChatOnlineMembersUpdated,
      { _id: chatId },
      onlineMembers,
      onlineMembersCount,
      eventSource,
    );
  }

  public async getAllJoinedChatsIdsByConnection(connectionId: string): Promise<string[]> {
    const socketChatIdsKey: string = `socket:${connectionId}:joined-chats`;
    const redisResponse: any = await this.redisClient.getClient().hgetall(socketChatIdsKey);

    return redisResponse ? Object.keys(redisResponse) : [];
  }

  public async getAllSocketIds(memberId: string): Promise<string[]> {
    const userConnectionKeys: string = `member:${memberId}:connections`;
    const redisResponse: any = await this.redisClient.getClient().hgetall(userConnectionKeys);

    return redisResponse ? Object.keys(redisResponse) : [];
  }

  public async getChatOnlineMembers(chatId: string): Promise<ChatOnlineMemberInterface[]> {
    const chatOnlineMemberKey: string = `chat:${chatId}:online-members`;
    const redisResponse: any = await this.redisClient.getClient().hgetall(chatOnlineMemberKey);
    const onlineMembers: ChatOnlineMemberInterface[] = [];
    for (const key in redisResponse) {
      if (!redisResponse[key]) {
        continue;
      }
      const json: string = redisResponse[key];
      onlineMembers.push(JSON.parse(json));
    }

    return onlineMembers;
  }

  public countOnlineMembers(onlineMembers: ChatOnlineMemberInterface[]): number {
    if (!onlineMembers) {
      return 0;
    }

    const now: any = moment();
    const countedUsers: string[] = [];
    for (const member of onlineMembers) {
      if (!member?.user) {
        continue;
      }
      if (countedUsers.filter((user: string) => user === member.user).length > 0) {
        continue;
      }
      if (member.lastActivity && now.diff(member.lastActivity, 'hours') > 5) {
        continue;
      }
      countedUsers.push(member.user);
    }

    return countedUsers.length;
  }

  public async addMemberSocketId(memberId: string, socketId: string): Promise<void> {
    if (memberId && socketId) {
      await this.redisClient.getClient().hset(`member:${memberId}:connections`, socketId, socketId);
    }
  }

  public async removeMemberSocketId(memberId: string, socketId: string): Promise<void> {
    if (memberId && socketId) {
      await this.redisClient.getClient().hdel(`member:${memberId}:connections`, socketId);
    }
  }

  public async getMember(userId: string, contactId: string): Promise<ChatOnlineMemberInterface> {
    const user: UserDocument = userId ? await this.usersService.findById(userId) : null;
    const contact: ContactDocument = contactId ? await this.contactsService.findById(contactId) : null;

    return {
      contact,
      contactId,
      user: userId,
      userAccount: user && user.userAccount ? {
        email: user.userAccount.email,
        firstName: user.userAccount.firstName,
        lastName: user.userAccount.lastName,
        logo: user.userAccount.logo,
        phone: user.userAccount.phone,
      } : {
        firstName: contact?.name,
      } as any,
    };
  }
}
