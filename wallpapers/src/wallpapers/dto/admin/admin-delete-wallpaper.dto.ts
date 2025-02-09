import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminDeleteWallpaperDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public wallpaper: string;
}
