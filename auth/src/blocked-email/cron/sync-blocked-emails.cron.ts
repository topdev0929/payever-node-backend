import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@pe/cron-kit';
import { BlockEmailService } from '../services';

@Injectable()
export class SyncBlockedEmailsCron {

  constructor(
    private readonly blockEmailService: BlockEmailService,
    private readonly logger: Logger,
  ) {
  }

  @Cron(`0 0 * * 0`)
  private async synchronizeBlockedEmails(): Promise<void> {
    this.logger.log('Sync Blocked Emails Cron called');
    await this.blockEmailService.synchronizeBlockedEmails();
  }
}
