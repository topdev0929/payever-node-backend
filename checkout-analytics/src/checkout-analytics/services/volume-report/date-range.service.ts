export class DateRangeService {
  public static getFirstDayOfLastMonth(): Date {
    return DateRangeService.getFirstDayOfMonth(-1);
  }

  public static getLastDayOfLastMonth(): Date {
    return DateRangeService.getLastDayOfMonth(-1);
  }

  public static getFirstDayOfPreviousMonth(): Date {
    return DateRangeService.getFirstDayOfMonth(-2);
  }

  public static getLastDayOfPreviousMonth(): Date {
    return DateRangeService.getLastDayOfMonth(-2);
  }


  public static getFormattedReportDateRange(
    dateFrom: Date,
    dateTo: Date,
  ): string {
    const formattedFromDate: string = `${('0' + (dateFrom.getUTCMonth() + 1)).slice(-2)}-${dateFrom.getUTCFullYear()}`;
    const formattedToDate: string = `${('0' + (dateTo.getUTCMonth() + 1)).slice(-2)}-${dateTo.getUTCFullYear()}`;
    const formattedRangeDate: string = `${formattedFromDate} - ${formattedToDate}`;

    return formattedFromDate === formattedToDate ? formattedFromDate : formattedRangeDate;
  }

  public static getPrevDay(isStart: boolean): Date {
    const previousDay: number = (new Date()).getUTCDate() - 1;

    const date: Date = new Date();
    date.setUTCDate(previousDay);
    if (isStart) {
      date.setUTCHours(0, 0, 0, 0);
    } else {
      date.setUTCHours(23, 59, 59, 999);
    }

    return date;
  }


  private static getFirstDayOfMonth(monthIncrement: number): Date {
    const previousMonth: number = (new Date()).getUTCMonth() + monthIncrement;

    const date: Date = new Date();
    date.setUTCMonth(previousMonth, 1);
    date.setUTCHours(0, 0, 0, 0);

    return date;
  }

  private static getLastDayOfMonth(monthIncrement: number): Date {
    const previousMonth: number = (new Date()).getUTCMonth() + monthIncrement;

    const date: Date = new Date();
    date.setUTCMonth(previousMonth + 1, 0);
    date.setUTCHours(23, 59, 59, 999);

    return date;
  }
}
