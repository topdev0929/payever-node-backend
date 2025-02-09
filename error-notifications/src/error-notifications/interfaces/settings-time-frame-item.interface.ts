import { StatusConditionInterface } from './status-condition.interface';

export interface SettingsTimeFrameItem {
  startDayOfWeek: number;
  startHour: number;
  startMinutes: number;

  endDayOfWeek: number;
  endHour: number;
  endMinutes: number;

  sendEmailAfterInterval: number;
  repeatFrequencyInterval: number;

  statusCondition?: StatusConditionInterface;
}
