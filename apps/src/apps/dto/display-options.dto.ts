import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class DisplayOptionsDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public bgColor?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public icon?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public title?: string;
}
