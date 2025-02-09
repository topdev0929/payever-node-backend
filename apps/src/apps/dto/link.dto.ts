import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LinkDto {
  @ApiProperty()
  @IsString()
  public type: string;

  @ApiProperty()
  @IsString()
  public url: string;
}
