import { SettingsTimeFrameItem, TimeFramePeriodInterface } from '../interfaces';
import * as dateFns from 'date-fns';

export class TimeFrameHelper {

  public static getTimeFramePeriod(
    settingsTimeFrame: SettingsTimeFrameItem,
    baseDate: Date,
  ): TimeFramePeriodInterface {
    const year: number = baseDate.getFullYear();
    const month: number = baseDate.getMonth();
    const day: number = baseDate.getDate();
    let startTime: Date;
    let endTime: Date;

    const coverAllDay: boolean =
      settingsTimeFrame.startHour === settingsTimeFrame.endHour &&
      settingsTimeFrame.startMinutes === settingsTimeFrame.endMinutes;

    if (coverAllDay) {
      startTime = new Date(year, month, day, 0, 0, 0, 0);
      endTime = dateFns.addDays(startTime, 1);
    } else {
      startTime = new Date(year, month, day, settingsTimeFrame.startHour, settingsTimeFrame.startMinutes);
      endTime = new Date(year, month, day, settingsTimeFrame.endHour, settingsTimeFrame.endMinutes);

      if (settingsTimeFrame.endHour === 0 && settingsTimeFrame.endMinutes === 0) {
        endTime = new Date(year, month, day, 0, 0, 0, 0);
        endTime = dateFns.addDays(endTime, 1);
      }
    }

    return {
      endTime,
      startTime,
    };
  }
}
