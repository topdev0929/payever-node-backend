import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { SettingsInterface } from '../interfaces';
import { CronUpdateIntervalEnum, ErrorNotificationTypesEnum, SendingMethodEnum } from '../enums';
import { TimeFrameSettingsItemDto } from './';

@Exclude()
export class SettingsDto implements SettingsInterface {
  @ApiProperty()
  @IsString()
  @Expose()
  public businessId: string;

  @ApiProperty()
  @IsEnum(SendingMethodEnum)
  @Expose()
  public sendingMethod: SendingMethodEnum;

  @ApiProperty()
  @IsEnum(ErrorNotificationTypesEnum)
  @Expose()
  public type: ErrorNotificationTypesEnum;

  @ApiProperty()
  @Expose()
  public isEnabled: boolean;

  @ApiProperty()
  @IsEnum(CronUpdateIntervalEnum)
  @Expose()
  @IsOptional()
  public updateInterval?: CronUpdateIntervalEnum;

  @ApiProperty({ type: () => [TimeFrameSettingsItemDto]})
  @Expose()
  @IsOptional()
  @IsArray()
  public timeFrames?: TimeFrameSettingsItemDto[];

  @ApiProperty()
  @Expose()
  @IsOptional()
  public integration?: string;

  @ApiProperty()
  @Expose()
  @IsOptional()
  public repeatFrequencyInterval?: number;

}
