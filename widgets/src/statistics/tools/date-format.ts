import * as dateFormat from 'dateformat';
import { DateFormatEnum } from '../../apps/transactions-app/enums';

export class DateFormat {
  public static daily(date: Date): string {
    return dateFormat(date, DateFormatEnum.Daily);
  }

  public static monthly(date: Date): string {
    return dateFormat(date, DateFormatEnum.Monthly);
  }
}
