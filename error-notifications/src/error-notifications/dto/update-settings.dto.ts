import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsDefined, IsArray, ValidateNested, Equals, IsInt, Min, Max } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { AbstractSettingsInterface } from '../interfaces';
import { CronUpdateIntervalEnum, SendingMethodEnum } from '../enums';
import { TimeFrameSettingsItemDto } from './';
import { EndTimeLessThanStartTime, OverlappedTimeFrames } from '../decorators';

@Exclude()
export class UpdateSettingsDto implements AbstractSettingsInterface {
  @ApiProperty()
  @Expose()
  @IsEnum(SendingMethodEnum)
  @Equals(SendingMethodEnum.sendByCronInterval, { groups: [SendingMethodEnum.sendByCronInterval] })
  @Equals(SendingMethodEnum.sendByAfterInterval, { groups: [SendingMethodEnum.sendByAfterInterval] })
  public sendingMethod: SendingMethodEnum;

  @ApiProperty()
  @Expose()
  @IsDefined()
  public isEnabled: boolean;

  @ApiProperty()
  @IsEnum(CronUpdateIntervalEnum)
  @Expose()
  @IsDefined({ groups: [SendingMethodEnum.sendByCronInterval] })
  @IsOptional({ groups: [SendingMethodEnum.sendByAfterInterval] })
  public updateInterval?: CronUpdateIntervalEnum;

  @ApiProperty({ type: () => [TimeFrameSettingsItemDto]})
  @Expose()
  @IsDefined({ groups: [SendingMethodEnum.sendByAfterInterval] })
  @IsOptional({ groups: [SendingMethodEnum.sendByCronInterval] })
  @IsArray( { groups: [SendingMethodEnum.sendByCronInterval]})
  @ValidateNested({ groups: [SendingMethodEnum.sendByAfterInterval], each: true})
  @Type(() => TimeFrameSettingsItemDto)
  @EndTimeLessThanStartTime( { groups: [SendingMethodEnum.sendByAfterInterval]})
  @OverlappedTimeFrames( { groups: [SendingMethodEnum.sendByAfterInterval]})
  public timeFrames?: TimeFrameSettingsItemDto[];

  @ApiProperty()
  @Expose()
  @IsInt({ groups: [SendingMethodEnum.sendByCronInterval]})
  @Min(0, { groups: [SendingMethodEnum.sendByCronInterval]})
  @Max(60, { groups: [SendingMethodEnum.sendByCronInterval]})
  @IsDefined({ groups: [SendingMethodEnum.sendByCronInterval] })
  @IsOptional({ groups: [SendingMethodEnum.sendByAfterInterval] })
  public repeatFrequencyInterval?: number;

}
