import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public minVersion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public currentVersion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUrl()
  public appleStoreUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsUrl()
  public playStoreUrl?: string;
}
