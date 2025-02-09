import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsString,
  IsEnum,
  ValidateNested,
  ValidateIf,
  IsDateString,
} from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { TaskTypeEnum } from '../../enum';
import { ScheduleFilterRequestDto } from './schedule-filter.request.dto';
import { UrlActionsEnum } from '../../../legacy-api';
import { ScheduleDurationRequestDto } from './schedule-duration.request.dto';

@Exclude()
export class ScheduleRequestDto {
  @ApiProperty()
  @IsNotEmpty({ groups: ['create']})
  @IsEnum(TaskTypeEnum, { groups: ['create']})
  @Expose()
  public task: TaskTypeEnum;

  @ApiProperty()
  @IsNotEmpty({ groups: ['create']})
  @ValidateNested({ groups: ['create']})
  @Expose()
  public duration: ScheduleDurationRequestDto;

  @ApiPropertyOptional()
  @IsEnum(UrlActionsEnum, { groups: [TaskTypeEnum.paymentAction]})
  @IsOptional({ groups: [TaskTypeEnum.paymentLinkReminder]})
  @IsNotEmpty({ groups: [TaskTypeEnum.paymentAction]})
  @Expose()
  public action?: UrlActionsEnum;

  @ApiPropertyOptional()
  @IsString({ groups: [TaskTypeEnum.paymentAction, TaskTypeEnum.paymentLinkReminder]})
  @IsOptional({ groups: [TaskTypeEnum.paymentLinkReminder, 'payment_id']})
  @IsNotEmpty({ groups: [TaskTypeEnum.paymentAction]})
  @ValidateIf((o: ScheduleRequestDto) => !o.payment_id, { groups: [TaskTypeEnum.paymentAction]})
  @Expose()
  public payment_method?: string;

  @ApiPropertyOptional()
  @IsString({ groups: [TaskTypeEnum.paymentAction, TaskTypeEnum.paymentLinkReminder]})
  @IsOptional({ groups: [TaskTypeEnum.paymentLinkReminder, 'payment_method']})
  @IsNotEmpty({ groups: [TaskTypeEnum.paymentAction]})
  @ValidateIf((o: ScheduleRequestDto) => !o.payment_method, { groups: [TaskTypeEnum.paymentAction]})
  @Expose()
  public payment_id?: string;

  @ApiPropertyOptional()
  @IsOptional({ groups: [TaskTypeEnum.paymentAction, TaskTypeEnum.paymentLinkReminder]})
  @Expose()
  public payload?: any;

  @ApiPropertyOptional()
  @IsBoolean({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  @Expose()
  public enabled?: boolean = true;

  @ApiPropertyOptional()
  @IsOptional({ groups: [TaskTypeEnum.paymentAction, TaskTypeEnum.paymentLinkReminder]})
  @ValidateNested({ groups: [TaskTypeEnum.paymentAction, TaskTypeEnum.paymentLinkReminder]})
  @Type(() => ScheduleFilterRequestDto)
  @Expose()
  public filter?: ScheduleFilterRequestDto;

  @ApiPropertyOptional()
  @IsDateString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  @Expose()
  public start_date?: Date;

  @ApiPropertyOptional()
  @IsDateString({ groups: ['create']})
  @IsOptional({ groups: ['create']})
  @Expose()
  public end_date?: Date;
}
