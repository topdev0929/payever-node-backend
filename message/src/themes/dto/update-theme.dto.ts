import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { UpdateThemeSettingDto } from './update-theme-settings.dto';

export class UpdateThemeDto {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  public isDefault?: boolean;

  @ApiProperty({
    required: false,
    type: UpdateThemeSettingDto,
  })
  @Type(() => UpdateThemeSettingDto)
  @ValidateNested()
  @IsOptional()
  public settings: UpdateThemeSettingDto;
}
