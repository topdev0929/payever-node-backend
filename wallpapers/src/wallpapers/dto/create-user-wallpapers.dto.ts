import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserWallpapersInterface } from '../interfaces';
import { CreateWallpaperDto } from './create-wallpaper.dto';

export class CreateUserWallpapersDto implements UserWallpapersInterface {
  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  public myWallpapers: CreateWallpaperDto[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public user: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => CreateWallpaperDto)
  @ValidateNested()
  public currentWallpaper?: CreateWallpaperDto;
}
