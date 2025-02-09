import { registerDecorator, ValidationOptions } from 'class-validator';
import { SettingsTimeFrameItem, TimeFramePeriodInterface } from '../../interfaces';
import { TimeFrameDto } from '../../dto';
import { TimeFrameHelper } from '../../helpers/time-frame.helper';

export function OverlappedTimeFrames(
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  return (object: object, propertyName: string) => {
    registerDecorator({
      constraints: [],
      options: validationOptions,
      propertyName: propertyName,
      target: object.constructor,
      validator: {
        validate(timeFrames: SettingsTimeFrameItem[]): boolean {
          let result: boolean = true;

          const filledTimes: TimeFrameDto[] = [];
          timeFrames.forEach((timeFrameSettingItem: SettingsTimeFrameItem) => {
            const period: TimeFramePeriodInterface =
              TimeFrameHelper.getTimeFramePeriod(timeFrameSettingItem, new Date());

            const days: number[] = fillWeekDays(timeFrameSettingItem.startDayOfWeek, timeFrameSettingItem.endDayOfWeek);
            const curTimeFrame: TimeFrameDto = {
              days,
              endTime: period.endTime,
              startTime: period.startTime,
            };

            for (const timeFrame of filledTimes) {
              if ( isTimeFrameOverlapsOther(curTimeFrame, timeFrame)
                || isTimeFrameOverlapsOther(timeFrame, curTimeFrame)) {
                result = false;
              }
            }

            filledTimes.push(curTimeFrame);
          });

          return result;
        },

        defaultMessage(): string {
          return `Some of time frame overlaps other one. Time frames shouldn't be overlapped`;
        },
      },
    });
  };
}

function isTimeFrameOverlapsOther(timeFrameOne: TimeFrameDto, timeFrameTwo: TimeFrameDto): boolean {
  let containsOverlappedDays: boolean = false;
  for (const day of timeFrameOne.days) {
    if (timeFrameTwo.days.indexOf(day) > -1) {
      containsOverlappedDays = true;
    }
  }

  if (!containsOverlappedDays) {
    return  false;
  }

  return ( (timeFrameOne.startTime > timeFrameTwo.startTime && timeFrameOne.startTime < timeFrameTwo.endTime) ||
    (timeFrameOne.endTime > timeFrameTwo.startTime && timeFrameOne.endTime < timeFrameTwo.endTime) );

}

function fillWeekDays(startDayOfWeek: number, endDayOfWeek: number): number[] {
  const res: number[] = [];
  for (let i: number = startDayOfWeek; i <= endDayOfWeek; i++) {
    res.push(i);
  }

  return res;
}

