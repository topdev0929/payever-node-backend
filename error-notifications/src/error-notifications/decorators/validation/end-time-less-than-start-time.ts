import { registerDecorator, ValidationOptions } from 'class-validator';
import { SettingsTimeFrameItem, TimeFramePeriodInterface } from '../../interfaces';
import { TimeFrameHelper } from '../../helpers/time-frame.helper';

export function EndTimeLessThanStartTime(
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

          timeFrames.forEach((timeFrame: SettingsTimeFrameItem) => {
            const period: TimeFramePeriodInterface = TimeFrameHelper.getTimeFramePeriod(timeFrame, new Date());
            if ((period.startTime > period.endTime) || (timeFrame.startDayOfWeek > timeFrame.endDayOfWeek)) {
              result = false;
            }
          });

          return result;
        },

        defaultMessage(): string {
          return `Start time must be before end time, and both times must be on the same day`;
        },
      },
    });
  };
}
