import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { SearchDto } from './search.dto';

export class SearchProductWallpapersDto {
  @ApiProperty()
  @IsOptional()
  public conditions: SearchDto[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  public id?: string;
}
