import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateWallpaperDto } from '../create-wallpaper.dto';

export class AdminSetUserWallpaperDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public userId: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CreateWallpaperDto)
  public wallpapers: CreateWallpaperDto[];
}
