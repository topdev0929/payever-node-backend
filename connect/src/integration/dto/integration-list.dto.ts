import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from './pagination.dto';

export class IntegrationListDto extends PaginationDto {
  @ApiProperty({ required: false, isArray: true })
  @IsOptional()
  @IsString({ each: true })
  public categories: string[];
}
