import { Injectable } from '@nestjs/common';
import { Cron } from '@pe/cron-kit';
import { environment } from '../../environments';
import { DropboxService } from '../services';

@Injectable()
export class DropboxDownloadCron {

  constructor(
    private readonly dropboxService: DropboxService,
  ) {
  }

  @Cron(environment.cronTimer.everyMidnight)
  private async dropboxSave(): Promise<void> {
    await this.dropboxService.downloadTrigger();
  }
}
