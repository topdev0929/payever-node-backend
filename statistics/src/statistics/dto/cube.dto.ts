import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CubeInterface } from '../interfaces';

export class CubeDto implements CubeInterface {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  public enabled: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public code: string;
}
