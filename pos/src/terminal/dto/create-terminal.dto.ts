import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateTerminalDto {
  @ApiProperty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsOptional()
  public logo: string;
}
