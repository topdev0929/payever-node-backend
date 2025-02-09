import { Injectable, Logger } from '@nestjs/common';
import { Command, Option } from '@pe/nest-kit';

import { MessagesRedisService } from '../submodules/platform';

@Injectable()
export class MessageCacheCommand {
  constructor(
    private readonly messageRedisService: MessagesRedisService,
    private readonly logger: Logger,
  ) { }

  @Command({
    command: 'message-cache:clear-all',
    describe: 'Clear all cached messages',
  })
  public async clearAll(): Promise<void> {
    await this.messageRedisService.clearAll();
  }

  @Command({
    command: 'message-cache:print',
    describe: 'Print',
  })
  public async printIds(
    @Option({
      name: 'chat-id',
    }) chatId: string,
  ): Promise<void> {
    const messageIds: string[] = await this.messageRedisService.getCreatedChatMessageIds(chatId);
    this.logger.log(messageIds);
  }
}
