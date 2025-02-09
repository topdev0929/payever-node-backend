import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { BusinessWallpapersInterface } from '../interfaces';
import { CreateWallpaperDto } from './create-wallpaper.dto';

export class CreateBusinessWallpapersDto implements BusinessWallpapersInterface {
  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  public myWallpapers: CreateWallpaperDto[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => CreateWallpaperDto)
  @ValidateNested()
  public currentWallpaper?: CreateWallpaperDto;
}
