import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { DefaultSettingsInterface, SettingsTimeFrameItem } from '../interfaces';
import { CronUpdateIntervalEnum, ErrorNotificationTypesEnum, SendingMethodEnum } from '../enums';

@Exclude()
export class DefaultSettingsDto implements DefaultSettingsInterface {
  @ApiProperty()
  @IsEnum(ErrorNotificationTypesEnum)
  @Expose()
  public type: ErrorNotificationTypesEnum;

  @ApiProperty()
  @IsEnum(SendingMethodEnum)
  @Expose()
  public sendingMethod: SendingMethodEnum;

  @ApiProperty()
  @IsBoolean()
  @Expose()
  public isEnabled: boolean;

  @ApiProperty()
  @IsEnum(CronUpdateIntervalEnum)
  @Expose()
  @IsOptional()
  public updateInterval?: CronUpdateIntervalEnum;

  @ApiProperty()
  @Expose()
  @IsOptional()
  public timeFrames?: SettingsTimeFrameItem[];

  @ApiProperty()
  @Expose()
  @IsOptional()
  public integration?: string;

  @ApiProperty()
  @Expose()
  @IsOptional()
  @IsNumber()
  public repeatFrequencyInterval?: number;

}
