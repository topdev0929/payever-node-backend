import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { CreateWallpaperDto } from '../create-wallpaper.dto';

export class AdminCreateBusinessWallpaperDto extends CreateWallpaperDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public businessId: string;
}
