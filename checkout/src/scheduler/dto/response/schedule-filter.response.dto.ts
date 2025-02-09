import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ScheduleFilterResponseDto {
  @Expose({ name: 'dateGt'})
  public date_gt?: Date;

  @Expose({ name: 'dateLt'})
  public date_lt?: Date;

  @Expose()
  public status?: string;

  @Expose({ name: 'specificStatus'})
  public specific_status?: string;

  @Expose({ name: 'totalGt'})
  public total_gt?: number;

  @Expose({ name: 'totalLt'})
  public total_lt?: number;
}
