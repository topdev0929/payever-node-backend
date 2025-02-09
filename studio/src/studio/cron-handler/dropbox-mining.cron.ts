import { Injectable } from '@nestjs/common';
import { Cron } from '@pe/cron-kit';
import { environment } from '../../environments';
import { DropboxService } from '../services';

@Injectable()
export class DropboxMiningCron {

  constructor(
    private readonly dropboxService: DropboxService,
  ) {
  }

  @Cron(environment.cronTimer.everyMidnight)
  private async dropboxMining(): Promise<void> {
    await this.dropboxService.miningTrigger();
  }
}
