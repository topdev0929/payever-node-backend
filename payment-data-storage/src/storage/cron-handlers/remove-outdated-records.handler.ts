import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@pe/cron-kit';
import { RecordService } from '../services/record.service';

const RUN_DAILY_EXPRESSION: string = '0 0 * * *';

@Injectable()
export class RemoveOutdatedRecordsHandler {
  constructor(
    private readonly recordService: RecordService,
    private readonly logger: Logger,
  ) { }

  @Cron(RUN_DAILY_EXPRESSION)
  public async removeOutdatedRecords(): Promise<void> {
    const monthAgo: Date = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    await this.recordService.clearOutdated(monthAgo);

    this.logger.log({
      context: 'RemoveOutdatedRecordsHandler',
      message: 'Outdated records cleared',
    });
  }
}
