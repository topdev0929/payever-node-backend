import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsDefined } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ErrorNotificationTypesEnum } from '../enums';
import { UpdateSettingsDto } from './';

@Exclude()
export class UpdateSettingsBundleDto extends UpdateSettingsDto {
  @ApiProperty()
  @Expose()
  @IsEnum(ErrorNotificationTypesEnum)
  public type: ErrorNotificationTypesEnum;

  @ApiProperty()
  @Expose()
  @IsDefined({ groups: ['integration-related'] })
  @IsOptional({ groups: ['business-related'] })
  public integration?: string;
}
