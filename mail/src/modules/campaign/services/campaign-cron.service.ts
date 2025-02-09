import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CronTaskModel } from '../models';
import { CronTaskSchemaName } from '../schemas';
import { CreateCampaignCronDto } from '../dto';
import { CronPeriod } from '../enums';
import { DateHelper } from '../helpers/date-helper';

const DEFAULT_DAY: number = 1;
const DEFAULT_HOURS: number = 9;
const DEFAULT_MINUTES: number = 0;
const DEAFULT_DAY_OF_WEEK: string = 'monday';

@Injectable()
export class CampaignCronService {
  constructor(@InjectModel(CronTaskSchemaName) private cronTaskModel: Model<CronTaskModel>) { }

  public async createCampaignCron(dto: CreateCampaignCronDto): Promise<CronTaskModel> {
    const data: any = this.prepareData(dto);

    return this.cronTaskModel.create(data);
  }

  public async getAllTasks(): Promise<CronTaskModel[]> {
    return this.cronTaskModel.find();
  }

  public async getTasksToSend(): Promise<CronTaskModel[]> {
    const startCurrenMinute: Date = DateHelper.getStartCurrentMinute();
    const endCurrenMinute: Date = DateHelper.getEndCurrentMinute();
    const hours: number = DateHelper.getCurrentHours();
    const minutes: number = DateHelper.getCurrentMinutes();
    const day: number = DateHelper.getCurrentDay();
    const dayOfWeek: string = DateHelper.getCurrentdayOfWeek();

    const specificDateTasks: CronTaskModel[] = await this.findSpecificDateTasks(startCurrenMinute, endCurrenMinute);
    const dailyTasks: CronTaskModel[] = await this.findDailyTasks(hours, minutes);
    const weeklyTasks: CronTaskModel[] = await this.findWeeklyTasks(hours, minutes, dayOfWeek);
    const monthlyTasks: CronTaskModel[] = await this.findMonthlyTasks(hours, minutes, day);

    return [
      ...specificDateTasks,
      ...dailyTasks,
      ...weeklyTasks,
      ...monthlyTasks,
    ];
  }

  public async findSpecificDateTasks(start: Date, end: Date): Promise<CronTaskModel[]> {
    return this.cronTaskModel.find({ date: { $gte: start, $lte: end }, period: CronPeriod.Once });
  }

  public async findDailyTasks(hours: number, minutes: number): Promise<CronTaskModel[]> {
    return this.cronTaskModel.find({ 
      hours: hours, 
      minutes: minutes,
      period: CronPeriod.Day, 
    });
  }

  public async findWeeklyTasks(hours: number, minutes: number, dayOfWeek: string): Promise<CronTaskModel[]> {
    return this.cronTaskModel.find({ 
      dayOfWeek: dayOfWeek, 
      hours: hours, 
      minutes: minutes,
      period: CronPeriod.Week, 
    });
  }

  public async findMonthlyTasks(hours: number, minutes: number, day: number): Promise<CronTaskModel[]> {
    return this.cronTaskModel.find({ 
      day: day, 
      hours: hours, 
      minutes: minutes,
      period: CronPeriod.Month,
    });
  }

  private prepareData(dto: CreateCampaignCronDto): any {
    const result: any = {
      input: dto.campaign,
      minutes: dto.minutes || DEFAULT_MINUTES,
      period: dto.period,
    };

    switch (dto.period) {
      case CronPeriod.Day:
        result.hours = dto.hours || DEFAULT_HOURS;
        break;
      case CronPeriod.Week:
        result.dayOfWeek = dto.dayOfWeek || DEAFULT_DAY_OF_WEEK;
        result.hours = dto.hours || DEFAULT_HOURS;
        break; 
      case CronPeriod.Month:
        result.day = dto.day || DEFAULT_DAY;
        result.hours = dto.hours || DEFAULT_HOURS;
        break;
      case CronPeriod.Once:
        result.date = DateHelper.getDateByString(dto.date);
        break; 
    }
    
    return result;
  }
}
