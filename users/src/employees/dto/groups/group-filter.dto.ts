import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GroupFilterDto {
  @ApiProperty()
  @IsOptional()
  @Transform((value: string) => (value ? new RegExp(value) : value))
  public name?: RegExp;
}
