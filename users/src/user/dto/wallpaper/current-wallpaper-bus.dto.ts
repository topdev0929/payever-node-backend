import { IsNotEmpty, IsString } from 'class-validator';
import { CurrentWallpaperDto } from './current-wallpaper.dto';

export class CurrentWallpaperBusDto {
  @IsNotEmpty()
  @IsString()
  public businessId: string;

  @IsNotEmpty()
  public currentWallpaper: CurrentWallpaperDto;
}
