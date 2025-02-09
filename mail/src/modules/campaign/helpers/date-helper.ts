const CET_TZ_OFFSET: number = 1;
const DAYS_OF_WEEK: string[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'friday',
  'saturday',
];

export class DateHelper {
  public static addHours(hours: number): Date {
    const result: Date = new Date();
    result.setHours(result.getHours() + hours);

    return result;
  }

  public static addDays(days: number): Date {
    const result: Date = new Date();
    result.setDate(result.getDate() + days);

    return result;
  }

  public static addWeeks(weeks: number): Date {
    const days: number = weeks * 7;

    return this.addDays(days);
  }

  public static addMonths(months: number): Date {
    const result: Date = new Date();
    result.setMonth(result.getMonth() + months);

    return result;
  }

  public static getStartCurrentMinute(): Date {
    const startCurrenMinute: Date = new Date();
    startCurrenMinute.setSeconds(0, 0);

    return startCurrenMinute;
  }

  public static getEndCurrentMinute(): Date {
    const endCurrenMinute: Date = new Date();
    endCurrenMinute.setSeconds(59, 999);

    return endCurrenMinute;
  }

  public static getCurrentHours(): number {
    const now: Date = new Date();

    return now.getHours() + CET_TZ_OFFSET;
  }

  public static getCurrentMinutes(): number {
    const now: Date = new Date();

    return now.getMinutes();
  }

  public static getCurrentDay(): number {
    const now: Date = new Date();

    return now.getDate();
  }

  public static getCurrentdayOfWeek(): string {
    const now: Date = new Date();

    return DAYS_OF_WEEK[now.getDay()];
  }

  public static getDateByString(dateString: string): Date {
    return new Date(dateString);
  }
}
