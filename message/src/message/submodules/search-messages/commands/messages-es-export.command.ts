import { QueryCursor, FilterQuery } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';

import { Command, Positional } from '@pe/nest-kit';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { ChatMessageStatusEnum } from '@pe/message-kit';
import { ElasticMessageEnum } from '../../../enums';
import {
  CommonMessagingService,
  AbstractMessagingDocument,
  ChatMessageService,
  AbstractChatMessageDocument,
  ChatTextMessage,
} from '../../platform';
import {
  messageToEsTransformer,
} from '../transformers';
import { MessageEsDocument } from '../interfaces';

const BATCH_SIZE: number = +process.env.BATCH_SIZE || 1000;

@Injectable()
export class MessagesEsExportCommand {
  private salts: Map<string, string> = new Map();
  constructor(
    private readonly commonMessagingService: CommonMessagingService,
    private readonly messageService: ChatMessageService,
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly logger: Logger,
  ) { }

  /* tslint:disable:cognitive-complexity */
  @Command({ command: 'messages:es:export', describe: 'Export messages for ElasticSearch' })
  public async export(
    @Positional({
      name: 'chat',
    }) chatId: string,
  ): Promise<void> {
    const criteria: FilterQuery<AbstractChatMessageDocument> = { status: { $ne: ChatMessageStatusEnum.DELETED } };

    if (chatId) {
      criteria.chat = chatId;
    }

    this.logger.log(`Criteria is ${JSON.stringify(criteria, null, 2)}.`);

    let processedMessagesCount: number = 0;

    const messagesStream: QueryCursor<AbstractChatMessageDocument> = this.messageService
      .find(criteria)
      .cursor({ batchSize: BATCH_SIZE });

    const batch: MessageEsDocument[] = [];
    // tslint:disable-next-line: await-promise
    for await (const message of messagesStream) {
      if (!ChatTextMessage.isTypeOf(message)) {
        continue;
      }
      const salt: string = await this.getSaltByChatId(message.chat);
      if (!salt) {
        continue;
      }

      const item: MessageEsDocument = messageToEsTransformer(
        await this.commonMessagingService.decryptMessage(message, salt),
      );

      batch.push(item);
      processedMessagesCount++;

      if (batch.length >= BATCH_SIZE) {
        const batchToIndex: MessageEsDocument[] = [...batch];
        batch.length = 0;

        await this.elasticSearchClient.bulkIndex(
          ElasticMessageEnum.index,
          batchToIndex,
        );
      }
    }

    await this.elasticSearchClient.bulkIndex(
      ElasticMessageEnum.index,
      batch,
    );

    this.logger.log(processedMessagesCount + ' messages was processed');
  }

  public async getSaltByChatId(chatId: string): Promise<string> {
    if (!this.salts.has(chatId)) {
      const chat: AbstractMessagingDocument = await this.commonMessagingService.findById(chatId);
      if (!chat) {
        return null;
      }
      this.salts.set(chat._id, chat.salt);
    }

    return this.salts.get(chatId);
  }
}
