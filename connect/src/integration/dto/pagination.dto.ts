import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

import { SortDto } from './sort.dto';

export class PaginationDto extends SortDto {
  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  public page: number = 1;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  public limit: number = 10;
}
