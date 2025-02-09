import { Exclude, Expose } from 'class-transformer';
import { DurationTypeEnum, DurationUnitEnum } from '../../enum';

@Exclude()
export class ScheduleDurationResponseDto {
  @Expose()
  public type?: DurationTypeEnum;

  @Expose()
  public unit?: DurationUnitEnum;

  @Expose()
  public period?: number;
}
