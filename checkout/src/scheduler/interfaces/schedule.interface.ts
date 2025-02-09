import { DurationTypeEnum, DurationUnitEnum, TaskTypeEnum } from '../enum';
import { UrlActionsEnum } from '../../legacy-api';

export interface ScheduleInterface {
  _id?: string;
  task: TaskTypeEnum;
  duration: {
    type: DurationTypeEnum;
    period: number;
    unit: DurationUnitEnum;
  };
  action?: UrlActionsEnum;
  paymentId?: string;
  paymentMethod?: string;
  payload?: any;
  enabled: boolean;
  filter?: {
    dateGt?: Date;
    dateLt?: Date;
    status?: string;
    specificStatus?: string;
    totalGt?: number;
    totalLt?: number;
  };
  lastRun?: Date;
  businessId: string;
  startDate?: Date;
  endDate?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}
