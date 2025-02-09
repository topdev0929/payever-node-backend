import { Exclude, Expose, Type } from 'class-transformer';
import { TaskTypeEnum } from '../../enum';
import { UrlActionsEnum } from '../../../legacy-api';
import { ScheduleFilterResponseDto } from './schedule-filter.response.dto';
import { ScheduleDurationResponseDto } from './schedule-duration.response.dto';

@Exclude()
export class ScheduleResponseDto {
  @Expose()
  public _id: string;

  @Expose()
  public task: TaskTypeEnum;

  @Expose()
  @Type(() => ScheduleDurationResponseDto)
  public duration: ScheduleDurationResponseDto;

  @Expose()
  public action?: UrlActionsEnum;

  @Expose({ name: 'paymentId'})
  public payment_id?: string;

  @Expose({ name: 'paymentMethod'})
  public payment_method?: string;

  @Expose()
  public payload?: any;

  @Expose()
  public enabled: boolean;

  @Expose()
  @Type(() => ScheduleFilterResponseDto)
  public filter?: ScheduleFilterResponseDto;

  @Expose({ name: 'startDate'})
  public start_date?: Date;

  @Expose({ name: 'endDate'})
  public end_date?: Date;
}
