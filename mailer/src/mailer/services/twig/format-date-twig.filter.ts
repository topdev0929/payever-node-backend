import * as moment from 'moment';

export class FormatDateTwigFilter {
  public static filter(value: Date): string {
    return moment(value).format('D MMM YYYY, hh:mm:ss');
  }
}
