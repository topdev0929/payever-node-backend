import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { CreateWallpaperDto } from '../create-wallpaper.dto';

export class AdminCreateUserWallpaperDto extends CreateWallpaperDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public userId: string;
}
