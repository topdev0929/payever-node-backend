import { Injectable } from '@nestjs/common';
import { Cron } from '@pe/cron-kit';
import { environment } from '../../environments';
import { ImageAssessmentTaskProcessorService } from '../services';

@Injectable()
export class ImageAssessmentTaskCron {

  constructor(
    private readonly imageAssessmentTaskProcessorService: ImageAssessmentTaskProcessorService,
  ) {
  }

  @Cron(environment.cronTimer.imageAssessment)
  private async processSchedulerTask(): Promise<void> {
    await this.imageAssessmentTaskProcessorService.processTask();
  }
}
