import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CurrentWallpaperDto } from './current-wallpaper.dto';

export class WallpaperUpdatedDto {
  @IsNotEmpty()
  @IsString()
  public businessId: string;

  @ValidateNested()
  @Type(() => CurrentWallpaperDto)
  public currentWallpaper: CurrentWallpaperDto;
}

