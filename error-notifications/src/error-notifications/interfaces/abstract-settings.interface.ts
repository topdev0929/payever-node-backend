import { CronUpdateIntervalEnum, SendingMethodEnum } from '../enums';
import { SettingsTimeFrameItem } from './settings-time-frame-item.interface';

export interface AbstractSettingsInterface {
  sendingMethod: SendingMethodEnum;
  isEnabled: boolean;
  updateInterval?: CronUpdateIntervalEnum;
  timeFrames?: SettingsTimeFrameItem[];
  integration?: string;
  repeatFrequencyInterval?: number;
}
