import { Injectable, Logger } from '@nestjs/common';
import { QueryCursor, FilterQuery } from 'mongoose';

import { Command, Positional } from '@pe/nest-kit';
import { ChatMessageStatusEnum } from '@pe/message-kit';
import {
  AbstractMessagingDocument,
  ChatMessageService,
  AbstractChatMessageDocument,
  CommonMessagingService,
  AbstractChatMessage,
} from '../submodules/platform';

const BATCH_SIZE: number = +process.env.BATCH_SIZE || 1000;

@Injectable()
export class SyncLastMessagesCommand {
  constructor(
    private readonly commonMessagingService: CommonMessagingService,
    private readonly messageService: ChatMessageService,
    private readonly logger: Logger,
  ) { }

  @Command({
    command: 'last-messages:sync [--chat=uuid]',
    describe: 'Sync last messages from messages',
  })
  public async sync(
    @Positional({
      name: 'chat',
    }) chatId: string,
  ): Promise<void> {
    const filter: FilterQuery<AbstractMessagingDocument> = { };
    if (chatId) {
      filter._id = chatId;
    }
    const chatsStream: QueryCursor<AbstractMessagingDocument> = this.commonMessagingService
      .find(filter)
      .cursor({ batchSize: BATCH_SIZE });
    // tslint:disable-next-line: await-promise
    for await (const chatStreamItem of chatsStream) {
      const chat: AbstractMessagingDocument = chatStreamItem;
      const messagesStream: QueryCursor<AbstractChatMessageDocument> = this.messageService.find({
        chat: chat._id,
        status: { $ne: ChatMessageStatusEnum.DELETED },
      }).sort({
        createdAt: -1,
      }).cursor({ batchSize: BATCH_SIZE });

      await this.processMessages(chat, messagesStream);
    }
  }

  private async processMessages(
    chat: AbstractMessagingDocument,
    messagesStream: QueryCursor<AbstractChatMessageDocument>,
  ): Promise<void> {
    let processedLastMessagesLength: number = 0;

    // tslint:disable-next-line: await-promise
    for await (const messageStreamItem of messagesStream) {
      const message: AbstractChatMessageDocument = messageStreamItem;
      if (chat.lastMessages.some((lastMessage: AbstractChatMessage) => lastMessage._id === message._id)) {
        if (message.status === ChatMessageStatusEnum.DELETED) {
          await this.commonMessagingService.deleteLastMessage(chat, message);
          this.logger.verbose(`removed ${chat._id} ${message._id}`, 'SYNC');
        } else {
          await this.commonMessagingService.replaceLastMessage(message);
          this.logger.verbose(`replaced ${chat._id} ${message._id}`, 'SYNC');
          processedLastMessagesLength++;
        }
      } else {
        await this.commonMessagingService.addLastMessage(message);
        this.logger.verbose(`added ${chat._id} ${message._id}`, 'SYNC');
        processedLastMessagesLength++;
      }
      if (processedLastMessagesLength >= 50) {
        break;
      }
    }
  }
}
