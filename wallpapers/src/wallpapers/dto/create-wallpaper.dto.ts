import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { WallPaperThemeEnum } from '../enum';
import { WallpaperInterface } from '../interfaces';

export class CreateWallpaperDto implements WallpaperInterface {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public wallpaper: string;

  @ApiProperty()
  @IsEnum(WallPaperThemeEnum)
  public theme: WallPaperThemeEnum;
}
