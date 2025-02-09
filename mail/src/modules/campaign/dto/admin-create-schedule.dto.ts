import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { ScheduleRecurringClass } from '../classes';
import { ScheduleTypeEnum } from '../enums';
import { ScheduleIntervalDto } from './schedule-interval.dto';
import { ScheduleRecurringDto } from './schedule-recurring.dto';

export class AdminCreateScheduleDto {
  @ApiProperty({ required: false })
  @IsOptional()
  public date: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => ScheduleIntervalDto)
  @ValidateNested()
  public interval: ScheduleIntervalDto;

  @ApiProperty({ required: false })
  @Type(() => ScheduleRecurringDto)
  @ValidateNested()
  @IsOptional()
  public recurring: ScheduleRecurringClass;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(ScheduleTypeEnum)
  public type: ScheduleTypeEnum;
}

