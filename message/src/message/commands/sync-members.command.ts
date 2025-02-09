import { Injectable } from '@nestjs/common';
import { Command, Option } from '@pe/nest-kit';
import { CommonMessagingService } from '../submodules/platform';
import { CommonChannelDocument } from '../submodules/messaging/common-channels';
import { MessagingTypeEnum } from '@pe/message-kit';
import { MemberSyncService } from '../services';

@Injectable()
export class SyncMembersCommand {
  constructor(
    private readonly commonMessagingService: CommonMessagingService,
    private readonly memberSyncService: MemberSyncService,
  ) {
  }

  @Command({
    command: 'members:sync',
    describe: 'add employees to business owner channels',
  })
  public async update(
    @Option({
      name: 'parallel',
    }) parallel: number = 20,
  ): Promise<void> {
    const allChannels: CommonChannelDocument[] = await this.getAllBusinessChannels();
    const chunks: CommonChannelDocument[][] = this.splitIntoChunks(parallel, allChannels);
    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(
          (channel: CommonChannelDocument) =>
            this.memberSyncService.addOwnerToChannel(channel),
        ),
      );
    }
  }

  private getAllBusinessChannels(): Promise<CommonChannelDocument[]> {
    return this.commonMessagingService.find({
      deleted: { $ne: true },
      type: MessagingTypeEnum.Channel,
    }) as any;
  }


  private splitIntoChunks<T>(n: number, source: T[]): T[][] {
    if (n === -1 || n > source.length) {
      return [source];
    }
    const chunks: T[][] = [];
    let i: number = 0;
    let j: number = 1;
    for (i = 0, j = 1; i < source.length; i += n, j++) {
      chunks.push(source.slice(i, i + n));
    }

    return chunks;
  }
}
