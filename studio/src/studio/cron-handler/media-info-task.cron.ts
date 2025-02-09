import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@pe/cron-kit';
import { environment } from '../../environments';
import { MediaInfoTaskProcessorService } from '../services/media-info-task-processor.service';

@Injectable()
export class MediaInfoTaskCron {

  constructor(
    private readonly mediaInfoTaskProcessorService: MediaInfoTaskProcessorService,
    private readonly logger: Logger,
  ) {
  }

  @Cron(environment.cronTimer.mediaInfo)
  private async processSchedulerTask(): Promise<void> {
    this.logger.log('Running cron for media info task...');
    await this.mediaInfoTaskProcessorService.processTask();
  }
}
