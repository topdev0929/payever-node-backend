import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { WallpaperThemeEnum } from '../../enums';

export class CurrentWallpaperDto {
  @IsOptional()
  @IsEnum(WallpaperThemeEnum)
  public theme?: WallpaperThemeEnum;

  @IsOptional()
  @IsBoolean()
  public auto?: boolean;

  @IsOptional()
  public name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  public wallpaper?: string;
}
