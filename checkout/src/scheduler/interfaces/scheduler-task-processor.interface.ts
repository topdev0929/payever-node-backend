import { ScheduleInterface } from './schedule.interface';
import { TaskTypeEnum } from '../enum';

export interface SchedulerTaskProcessorInterface {
  runTask(schedule: ScheduleInterface): Promise<void>;
  getIdentifier(): TaskTypeEnum;
}
