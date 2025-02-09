import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsDate, IsDateString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { TaskTypeEnum } from '../../enum';

@Exclude()
export class ScheduleFilterRequestDto {
  @ApiPropertyOptional()
  @IsDateString({ groups: [TaskTypeEnum.paymentAction, TaskTypeEnum.paymentLinkReminder]})
  @IsOptional({ groups: [TaskTypeEnum.paymentLinkReminder, TaskTypeEnum.paymentAction]})
  @Expose()
  public date_gt?: Date;

  @ApiPropertyOptional()
  @IsDateString({ groups: [TaskTypeEnum.paymentAction, TaskTypeEnum.paymentLinkReminder]})
  @IsOptional({ groups: [TaskTypeEnum.paymentLinkReminder, TaskTypeEnum.paymentAction]})
  @Expose()
  public date_lt?: Date;

  @ApiPropertyOptional()
  @IsString({ groups: [TaskTypeEnum.paymentAction, TaskTypeEnum.paymentLinkReminder]})
  @IsOptional({ groups: [TaskTypeEnum.paymentLinkReminder, TaskTypeEnum.paymentAction]})
  @Expose()
  public status?: string;

  @ApiPropertyOptional()
  @IsString({ groups: [TaskTypeEnum.paymentAction, TaskTypeEnum.paymentLinkReminder]})
  @IsOptional({ groups: [TaskTypeEnum.paymentLinkReminder, TaskTypeEnum.paymentAction]})
  @Expose()
  public specific_status?: string;

  @ApiPropertyOptional()
  @IsNumber({ }, { groups: [TaskTypeEnum.paymentAction, TaskTypeEnum.paymentLinkReminder]})
  @IsOptional({ groups: [TaskTypeEnum.paymentLinkReminder, TaskTypeEnum.paymentAction]})
  @Expose()
  public total_gt?: number;

  @ApiPropertyOptional()
  @IsNumber({ }, { groups: [TaskTypeEnum.paymentAction, TaskTypeEnum.paymentLinkReminder]})
  @IsOptional({ groups: [TaskTypeEnum.paymentLinkReminder, TaskTypeEnum.paymentAction]})
  @Expose()
  public total_lt?: number;
}
