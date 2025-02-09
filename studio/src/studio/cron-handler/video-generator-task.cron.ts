import { Injectable } from '@nestjs/common';
import { Cron } from '@pe/cron-kit';
import { environment } from '../../environments';
import { VideoGeneratorTaskProcessorService } from '../services';

@Injectable()
export class VideoGeneratorTaskCron {

  constructor(
    private readonly videoGeneratorCronTaskService: VideoGeneratorTaskProcessorService,
  ) {
  }

  @Cron(environment.cronTimer.videoGenerator)
  private async processSchedulerTask(): Promise<void> {
    await this.videoGeneratorCronTaskService.processTask();
  }
}
