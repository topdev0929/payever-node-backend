export interface CronTaskInterface {
  id: string;
  date: Date;
  day: number;
  dayOfWeek: string;
  hours: number;
  input: any;
  minutes: number;
  period: string;
}
