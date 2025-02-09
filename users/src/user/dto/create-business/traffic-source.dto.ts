import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class TrafficSourceDto {
  @ApiProperty()
  @IsString()
  public source: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public medium: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public campaign: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public content: string;
}
