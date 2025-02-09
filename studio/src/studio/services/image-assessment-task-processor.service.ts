import { Injectable } from '@nestjs/common';
import { AbstractCollector } from '@pe/nest-kit/modules/collector-pattern';
import { ImageAssessmentTaskModel } from '../models';
import { ImageAssessmentTaskService } from './image-assessment-task.service';
import { ImageAssessmentService } from './image-assessment.service';

@Injectable()
export class ImageAssessmentTaskProcessorService extends AbstractCollector{

  constructor(
    private readonly imageAssessmentService: ImageAssessmentService,
    private readonly imageAssessmentTaskService: ImageAssessmentTaskService,
  ) {
    super();
  }

  public async processTask(): Promise<void> {
    const imageAssessmentTasks: ImageAssessmentTaskModel[]
      = await this.imageAssessmentTaskService.findWaitingTask();
    await this.imageAssessmentTaskService.setProcessing(imageAssessmentTasks);
    await this.imageAssessmentService.runTask(imageAssessmentTasks);
  }
}
