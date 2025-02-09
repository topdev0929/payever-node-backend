import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SortDto {
  @ApiProperty()
  @IsOptional()
  public asc: string[];

  @ApiProperty()
  @IsOptional()
  public desc: string[];
}
