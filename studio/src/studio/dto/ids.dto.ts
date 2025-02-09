import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class IdsDto {
  @ApiProperty({
    description: `Array of id`,
  })
  @IsArray()
  @IsNotEmpty()
  public ids: string[];
}
