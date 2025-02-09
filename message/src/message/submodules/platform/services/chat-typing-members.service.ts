import { Injectable } from '@nestjs/common';
import { RedisClient, EventDispatcher } from '@pe/nest-kit';
import { EventOriginEnum } from '../../../enums';
import { InternalEventCodesEnum } from '../../../../common';
import { ChatOnlineMemberInterface } from '../../../schemas';
import * as moment from 'moment';
import { AbstractMessagingDocument } from '../schemas';
import { CommonMessagingService } from './common-messaging.service';
import { ChatOnlineMembersService } from './chat-online-members.service';


@Injectable()
export class ChatTypingMembersService {
  constructor(
    private readonly redisClient: RedisClient,
    private readonly eventDispatcher: EventDispatcher,
    private readonly messagingService: CommonMessagingService,
    private readonly onlineMembersService: ChatOnlineMembersService,
  ) {
  }

  public async clearAllCacheData(): Promise<void> {
     await this.redisClient.deleteKeysByPattern('chat:*:typing-members');
  }

  public async updateTypingMembers(
    chatId: string,
    contactId: string,
    userId: string,
    isTyping: boolean,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    const chatTypingMemberKey: string = `chat:${chatId}:typing-members`;
    const chatTypingMemberField: string = userId || contactId;
    const keyExists: boolean = 
      (await this.redisClient.getClient().hexists(chatTypingMemberKey, chatTypingMemberField)) === 1;
    if ((isTyping && keyExists) || (!isTyping && !keyExists)) {
      return;
    }

    const chat: AbstractMessagingDocument = await this.messagingService.findById(chatId);
    if (!chat) {
      return;
    }

    const member: ChatOnlineMemberInterface = await this.onlineMembersService.getMember(userId, contactId);
    if (isTyping) {
      member.lastActivity = new Date();
      await this.redisClient.getClient().hset(chatTypingMemberKey, chatTypingMemberField, JSON.stringify(member));
      await this.addWatchForStopTyping(chatId, contactId, userId, async () => {
        await this.updateTypingMembers(chatId, contactId, userId, false, eventSource);
      });
    } else {
      await this.redisClient.getClient().hdel(chatTypingMemberKey, chatTypingMemberField);
      await this.removeWatchForStopTyping(chatId, contactId, userId);
    }

    await this.emitTypingMembersUpdated(chat, member, isTyping, eventSource);
  }

  public async getChatTypingMembers(abstractMessagingId: string): Promise<ChatOnlineMemberInterface[]> {
    const chatTypingMembersKey: string = `chat:${abstractMessagingId}:typing-members`;

    const redisResponse: any = await this.redisClient.getClient().hgetall(chatTypingMembersKey);

    const typingMembers: ChatOnlineMemberInterface[] = [];

    for (const key in redisResponse) {
      if (!redisResponse[key]) {
        continue;
      }
      const json: string = redisResponse[key];
      typingMembers.push(JSON.parse(json));
    }

    const now: moment.Moment = moment();

    return typingMembers.filter(
      (typingMember: ChatOnlineMemberInterface) => now.diff(typingMember.lastActivity, 'minutes') < 1);
  }

  private async emitTypingMembersUpdated(
    chat: AbstractMessagingDocument,
    member: ChatOnlineMemberInterface,
    isTyping: boolean,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    const typingMembers: ChatOnlineMemberInterface[] = await this.getChatTypingMembers(chat._id);

    await this.eventDispatcher.dispatch(
      InternalEventCodesEnum.ChatTyping,
      chat,
      member,
      isTyping,
      typingMembers,
      eventSource,
    );
  }

  private async addWatchForStopTyping(chatId: string, contactId: string, userId: string, callBack: any): Promise<void> {
    if (!callBack) {
      return;
    }
    const chatTypingMemberKey: string = `chat:${chatId}:typing-members:watch`;
    const chatTypingMemberField: string = contactId || userId;
    const interval: number = 10 * 1000;
    await this.redisClient.getClient().hset(chatTypingMemberKey, chatTypingMemberField, Number(new Date()));

    setTimeout((): void => {
      this.redisClient.getClient().hget(chatTypingMemberKey, chatTypingMemberField).then((time: string) => {
        if (!time) {
          return;
        }
        const ellapsed: number = Number(new Date()) - Number(time);
        if (ellapsed >= interval) {
          callBack();
        }

      });

    }, interval);
  }

  private async removeWatchForStopTyping(chatId: string, contactId: string, userId: string): Promise<void> {
    const chatTypingMemberKey: string = `chat:${chatId}:typing-members:watch`;
    const chatTypingMemberField: string = contactId || userId;
    await this.redisClient.getClient().hdel(chatTypingMemberKey, chatTypingMemberField);
  }
}
