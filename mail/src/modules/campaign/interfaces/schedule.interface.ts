import { ScheduleIntervalEnum, ScheduleStatusEnum, ScheduleTypeEnum } from '../enums';

export interface ScheduleInterface {
  id?: string;
  campaign?: string;
  date?: Date;
  failCount?: number;
  history?: [Date];
  cronErrors?: [string];
  interval?: {
    number: number;
    type: ScheduleIntervalEnum;
  };
  recurring?: {
    fulfill: number;
    target: number;
  };
  status?: ScheduleStatusEnum;
  type: ScheduleTypeEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
