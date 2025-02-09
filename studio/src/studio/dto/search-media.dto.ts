import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class SearchMediaDto extends PaginationDto {
  @ApiProperty()
  @IsString()
  public name: string;
}
