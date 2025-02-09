import { ScheduleModel } from '../../../models';
import { ScheduleTypeEnum } from '../../../enums';

export interface ScheduleStrategyInterface {
  type: ScheduleTypeEnum;
  runTask: (
    body: ScheduleModel,
  ) => Promise<void>;
}
