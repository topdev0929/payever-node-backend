import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SortDto } from './sort.dto';

export class PaginationDto extends SortDto {
  @ApiProperty()
  @IsOptional()
  public page: string;

  @ApiProperty()
  @IsOptional()
  public limit: string;
}
