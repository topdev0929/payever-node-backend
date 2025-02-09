import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateWallpaperDto } from './create-wallpaper.dto';

export class CreateCountryCityWallpapersDto {
  @IsString()
  @IsNotEmpty()
  public city: string;

  @IsString()
  @IsOptional()
  public country: string;

  @IsString()
  @IsOptional()
  public fullPath: string;

  @IsOptional()
  @Type(() => CreateWallpaperDto)
  @ValidateNested()
  public wallpaper?: CreateWallpaperDto;
}
