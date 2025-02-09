import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { BusinessDto } from './business.dto';

export class DashboardDetailsDto {
  @ApiPropertyOptional()
  @IsOptional()
  public availableTypes: any[];

  @ApiPropertyOptional()
  @IsOptional()
  public business: BusinessDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  public isDefault: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public _id: string;
}
