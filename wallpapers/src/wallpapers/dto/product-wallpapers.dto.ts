import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { WallpaperInterface } from '../interfaces';
import { WallPaperThemeEnum } from '../enum';

export class ProductWallpapersDto implements WallpaperInterface {
  @ApiProperty()
  @IsString()
  public wallpaper: string;

  @ApiProperty()
  @IsEnum(WallPaperThemeEnum)
  public theme: WallPaperThemeEnum;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public industry?: string;
}
