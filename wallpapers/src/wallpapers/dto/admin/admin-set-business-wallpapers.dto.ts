import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateWallpaperDto } from '../create-wallpaper.dto';

export class AdminSetBusinessWallpaperDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CreateWallpaperDto)
  public wallpapers: CreateWallpaperDto[];
}
