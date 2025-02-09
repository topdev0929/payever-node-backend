import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateWallpaperDto } from './create-wallpaper.dto';

export class UpdateProductWallpaperDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public product_code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public industry_code: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => CreateWallpaperDto)
  public wallpapers: CreateWallpaperDto[];
}
