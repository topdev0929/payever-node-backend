import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
} from 'class-validator';
import {
  Transform,
} from 'class-transformer';

import { WallpaperThemeEnum } from '../../../enums';

export class WallpaperMessagDto {
  @ApiProperty()
  @Transform((value: string) => value === '' ? WallpaperThemeEnum.Default : value)
  @IsEnum(WallpaperThemeEnum)
  public theme: WallpaperThemeEnum = WallpaperThemeEnum.Default;

  @ApiProperty()
  @IsString()
  public wallpaper: string;
}
