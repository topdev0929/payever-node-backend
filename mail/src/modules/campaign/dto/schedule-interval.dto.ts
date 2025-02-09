import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { ScheduleIntervalEnum } from '../enums';

export class ScheduleIntervalDto {
  @IsNotEmpty()
  @IsNumber()
  public number: number;

  @IsNotEmpty()
  @IsEnum(ScheduleIntervalEnum)
  public type: ScheduleIntervalEnum;
}
