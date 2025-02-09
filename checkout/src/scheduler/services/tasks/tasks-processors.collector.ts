import { Injectable, NotImplementedException } from '@nestjs/common';
import { AbstractCollector, Collector } from '@pe/nest-kit';
import { SCHEDULER_TASK_PROCESSOR } from '../../constants';
import { ScheduleInterface, SchedulerTaskProcessorInterface } from '../../interfaces';

@Injectable()
@Collector(SCHEDULER_TASK_PROCESSOR)
export class TasksProcessorsCollector extends AbstractCollector {
  protected services: SchedulerTaskProcessorInterface[];

  public async runTask(
    schedule: ScheduleInterface,
  ): Promise<void> {
    const taskProcessor: SchedulerTaskProcessorInterface =
      this.services.find((value: SchedulerTaskProcessorInterface) => value.getIdentifier() === schedule.task);

    if (!taskProcessor) {
      throw new NotImplementedException(`Processor is missing for task "${schedule.task}"`);
    }

    await taskProcessor.runTask(schedule);
  }
}
