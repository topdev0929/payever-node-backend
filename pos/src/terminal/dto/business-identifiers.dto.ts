import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class BusinessIdentifiersDto {
  @ApiProperty()
  @IsArray()
  public businessIds: string[];
}
