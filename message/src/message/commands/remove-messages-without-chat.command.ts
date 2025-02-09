import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Command } from '@pe/nest-kit';
import { ChatMessageStatusEnum } from '@pe/message-kit';
import {
  CommonMessagingService,
  AbstractMessagingDocument,
  ChatMessageService,
  AbstractChatMessageDocument,
  AbstractChatMessage,
} from '../submodules/platform';

@Injectable()
export class RemoveMessagesWithoutChatCommand {
  constructor(
    @InjectModel(AbstractChatMessage.name)
      private readonly chatMessageModel: Model<AbstractChatMessageDocument>,
    private readonly commonMessagingService: CommonMessagingService,
    private readonly messageService: ChatMessageService,
    private readonly logger: Logger,
  ) { }

  /* tslint:disable:cognitive-complexity */
  @Command({ command: 'messages:remove:without-chat', describe: 'Remove messages without chat' })
  public async removeWithoutChat(): Promise<void> {
    const criteria: any = { status: { $ne: ChatMessageStatusEnum.DELETED }};

    this.logger.log(`Criteria is ${JSON.stringify(criteria, null, 2)}.`);

    let page: number = 0;
    const limit: number = 1000;

    let processedMessagesCount: number = 0;
    const shouldBeRemoved: AbstractChatMessage[] = [];
    while (true) {
      const skip: number = page * limit;

      const messages: AbstractChatMessageDocument[] =
        await this.messageService.find(criteria).sort([['createdAt', 1]]).limit(limit).skip(skip).exec();

      if (!messages.length) {
        break;
      }

      for (const message of messages) {
        const chat: AbstractMessagingDocument = await this.commonMessagingService.findById(message.chat);

        if (!chat) {
          shouldBeRemoved.push(message);
        }
      }

      processedMessagesCount += messages.length;
      page++;
    }

    for (const message of shouldBeRemoved) {
      await this.chatMessageModel.findOneAndUpdate(
        {
          _id: message._id,
        },
        {
          $set: {
            status: ChatMessageStatusEnum.DELETED,
          },
        },
      ).exec();
    }

    this.logger.log(processedMessagesCount + ' messages was processed');
    this.logger.log(shouldBeRemoved.length + ' messages were removed');
  }
}
