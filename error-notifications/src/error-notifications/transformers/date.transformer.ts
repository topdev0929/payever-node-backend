// tslint:disable:object-literal-sort-keys
import { SeparatedDateDto } from '../dto';
import * as moment from 'moment';
import * as dateFns from 'date-fns';

export class DateTransformer {

  public static getSeparatedDate(date: Date): SeparatedDateDto {
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      date: date.getDate(),
      hour: date.getHours(),
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
      dayOfWeek: date.getDay() || 7,
    };
  }

  public static convertToCETTimeZone(date: Date): Date {
    const dateCETString: string = date.toLocaleString( 'en-US', { timeZone: 'Europe/Berlin'});

    return new Date(dateCETString);
  }

  public static convertLocalToCETTimeZone(date: Date): Date {
    const dateCET: Date = DateTransformer.convertToCETTimeZone(date);

    return dateFns.addMinutes(dateCET, -dateCET.getTimezoneOffset());
  }

  public static convertUTCToCETTimeZoneAndFormat(date: Date): string {
    const dateCET: Date = DateTransformer.convertToCETTimeZone(date);

    return moment(dateCET).format('YYYY-MM-DD HH:mm:ss') + ' CET';
  }


}
