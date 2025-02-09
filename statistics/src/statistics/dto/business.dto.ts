import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BusinessInterface } from '../interfaces';

export class BusinessDto implements BusinessInterface {
  @ApiPropertyOptional()
  @IsOptional()
  public installedApps?: any[];

  @ApiPropertyOptional()
  @IsOptional()
  public themeSettings?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public createdAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public updatedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public _id?: string;
}
