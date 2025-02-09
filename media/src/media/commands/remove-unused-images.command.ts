import { Injectable } from '@nestjs/common';
import { Command } from '@pe/nest-kit/modules/command';
import { sync } from 'mime-kind';
import { UnassignedMediaRemoverCron } from '../cron';

@Injectable()
export class RemoveUnusedImagesCommand {
  constructor(
    private readonly unassignedMediaRemover: UnassignedMediaRemoverCron,
  ) { }

  @Command({ command: 'media:remove-unassigned', describe: 'Removes unused images' })
  public async removeUnassignedMedia(): Promise<void> {
    await this.unassignedMediaRemover.removeOldUnassignedMedia();
  }
}
