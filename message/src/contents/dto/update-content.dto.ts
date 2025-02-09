import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateContentDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public icon?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  public url?: string;
}
