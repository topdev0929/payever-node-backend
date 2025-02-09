import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max, IsOptional, ValidateNested } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { SettingsTimeFrameItem } from '../interfaces';
import { SendingMethodEnum } from '../enums';
import { StatusConditionDto } from './';

@Exclude()
export class TimeFrameSettingsItemDto implements SettingsTimeFrameItem {
  @ApiProperty()
  @Expose()
  @IsInt({ groups: [SendingMethodEnum.sendByAfterInterval]})
  @Min(1, { groups: [SendingMethodEnum.sendByAfterInterval]})
  @Max(7, { groups: [SendingMethodEnum.sendByAfterInterval]})
  public startDayOfWeek: number;

  @ApiProperty()
  @Expose()
  @IsInt({ groups: [SendingMethodEnum.sendByAfterInterval]})
  @Min(0, { groups: [SendingMethodEnum.sendByAfterInterval]})
  @Max(23, { groups: [SendingMethodEnum.sendByAfterInterval]})
  public startHour: number;

  @ApiProperty()
  @Expose()
  @IsInt({ groups: [SendingMethodEnum.sendByAfterInterval]})
  @Min(0, { groups: [SendingMethodEnum.sendByAfterInterval]})
  @Max(59, { groups: [SendingMethodEnum.sendByAfterInterval]})
  public startMinutes: number;

  @ApiProperty()
  @Expose()
  @IsInt({ groups: [SendingMethodEnum.sendByAfterInterval]})
  @Min(1, { groups: [SendingMethodEnum.sendByAfterInterval]})
  @Max(7, { groups: [SendingMethodEnum.sendByAfterInterval]})
  public endDayOfWeek: number;

  @ApiProperty()
  @Expose()
  @IsInt({ groups: [SendingMethodEnum.sendByAfterInterval]})
  @Min(0, { groups: [SendingMethodEnum.sendByAfterInterval]})
  @Max(23, { groups: [SendingMethodEnum.sendByAfterInterval]})
  public endHour: number;

  @ApiProperty()
  @Expose()
  @IsInt({ groups: [SendingMethodEnum.sendByAfterInterval]})
  @Min(0, { groups: [SendingMethodEnum.sendByAfterInterval]})
  @Max(59, { groups: [SendingMethodEnum.sendByAfterInterval]})
  public endMinutes: number;

  @ApiProperty()
  @Expose()
  @IsInt({ groups: [SendingMethodEnum.sendByAfterInterval]})
  @Min(0, { groups: [SendingMethodEnum.sendByAfterInterval]})
  @Max(60, { groups: [SendingMethodEnum.sendByAfterInterval]})
  public repeatFrequencyInterval: number;

  @ApiProperty()
  @Expose()
  @IsInt({ groups: [SendingMethodEnum.sendByAfterInterval]})
  @Min(0, { groups: [SendingMethodEnum.sendByAfterInterval]})
  @Max(720, { groups: [SendingMethodEnum.sendByAfterInterval]})
  public sendEmailAfterInterval: number;

  @ApiProperty({ type: () => [StatusConditionDto]})
  @Expose()
  @IsOptional({ groups: [SendingMethodEnum.sendByAfterInterval]})
  @ValidateNested({ groups: [SendingMethodEnum.sendByAfterInterval]})
  @Type(() => StatusConditionDto)
  public statusCondition?: StatusConditionDto;

}
