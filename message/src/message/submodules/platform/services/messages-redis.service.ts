import { Injectable } from '@nestjs/common';
import { RedisClient } from '@pe/nest-kit';
import { MessageModelDbOperationDto } from '../../../dto/message-db-writer';
import { AbstractChatMessageInterface } from '@pe/message-kit';

@Injectable()
export class MessagesRedisService {

  constructor(
    private readonly redisClient: RedisClient,
  ) {
    
  }


  public async onDbOperationCreated(
    operation: 'create' | 'update',
    message: AbstractChatMessageInterface,
  ): Promise<void> {
    switch (operation) {
      case 'create':
        await this.onMessageCreted(message);
        break;
      case 'update':
        await this.onMessageUpdated(message);
        break;
      default:
        throw new Error(`db-operation '${operation}' is not defined`);
    }
  }

  public async onDbOperationPerformed(dto: MessageModelDbOperationDto): Promise<void> {
    if (dto.operation === 'create') {
      await this.removeMessageFromCache(dto.createModel.chat, dto.createModel._id);
    } else if (dto.operation === 'update-one') {
      const messageId: string = dto.filter._id;
      const message: any = await this.getMessageById(messageId);
      const chatId: string = message?.chat;
      await this.removeMessageFromCache(chatId, messageId);
    }
  }

  public async getMessageById(messageId: string): Promise<any> {
    const key: string = this.getMessageCachekey(messageId);
    const value: string = await this.redisClient.getClient().get(key);
    if (!value) {
      return;
    }
    const message: any = JSON.parse(value);
    message.isCachRead = true;
    message.toObject = () => message;

    return message;
  }

  public async getLastCreatedChatMessages(chatId: string, count: number = 0,
  ): Promise<any[]> {
    const messageIds: string[] = await this.getLastCreatedChatMessageIds(chatId, count);

    return Promise.all(messageIds.map((id: string) => this.getMessageById(id)));
  }

  public async getLastCreatedChatMessageIds(chatId: string, count: number = 0,
  ): Promise<string[]> {

    if (count === 0) {
      return this.getCreatedChatMessageIds(chatId);
    }

    const listKey: string = this.getChatCreatedMessagesListCacheKey(chatId);
    const len: number = await this.redisClient.getClient().llen(listKey);

    return len <= count ?
      this.getCreatedChatMessageIds(chatId, 0, -1) :
      this.getCreatedChatMessageIds(chatId, len - count, len - 1);
  }

  public async getCreatedChatMessageIds(chatId: string, startIndex: number = 0, stopIndex: number = -1,
  ): Promise<string[]> {
    const listKey: string = this.getChatCreatedMessagesListCacheKey(chatId);

    return this.redisClient.getClient().lrange(listKey, startIndex, stopIndex);
  }

  public async clearAll(): Promise<void> {
    await this.redisClient.deleteKeysByPattern('chat:*:created-message-list');
    await this.redisClient.deleteKeysByPattern('message:*:data');
  }

  private async onMessageCreted(
    message: AbstractChatMessageInterface,
  ): Promise<void> {
    const messageKey: string = this.getMessageCachekey(message._id);
    const listKey: string = this.getChatCreatedMessagesListCacheKey(message.chat);
    await Promise.all([
      this.redisClient.getClient().set(messageKey, JSON.stringify({ ...message, cacheWriteTime: new Date() })),
      this.redisClient.getClient().rpush(listKey, message._id),
    ]);
  }

  private async onMessageUpdated(
    updatedMessage: any,
  ): Promise<void> {
    const message: any = updatedMessage.toObject ? updatedMessage.toObject() : updatedMessage;
    const messageId: string = message._id;
    const messageKey: string = this.getMessageCachekey(messageId);
    await this.redisClient.getClient().set(messageKey, JSON.stringify({ ...message, cacheWriteTime: new Date() }));
  }

  private async removeMessageFromCache(chatId: string, messageId: string,
  ): Promise<void> {
    const editedListKey: string = this.getChatCreatedMessagesListCacheKey(chatId);
    const messageKey: string = this.getMessageCachekey(messageId);
    await Promise.all([
      this.redisClient.getClient().lrem(editedListKey, 0, messageId),
      this.redisClient.getClient().del(messageKey),
    ]);
  }

  private getChatCreatedMessagesListCacheKey(chatId: string): string {
    return `chat:${chatId}:created-message-list`;
  }

  private getMessageCachekey(messageId: string): string {
    return `message:${messageId}:data`;
  }
}
