import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ListDto } from './list.dto';

export class AdminBusinessWallpaperListDto extends ListDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ each: true })
  public businessIds?: string[];
}
