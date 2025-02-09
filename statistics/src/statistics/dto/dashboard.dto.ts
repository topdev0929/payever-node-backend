import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested, IsOptional, IsString } from 'class-validator';

import { DashboardInterface } from '../interfaces';
import { BusinessDto } from '../dto';

export class DashboardDto implements DashboardInterface {
  @ApiProperty()
  @ValidateNested()
  @IsNotEmpty()
  public business: BusinessDto;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public businessId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public name: string;
}
