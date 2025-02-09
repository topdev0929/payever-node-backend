import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class GroupUpdateHttpRequestDto {
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public description: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  public photo: string;
}
