import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class IsValidNameDto {
  @ApiProperty({ required: true})
  @IsString()
  public name?: string;
}
