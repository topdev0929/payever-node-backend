import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { DisplayOptionsDto } from './display-options.dto';
import { InstallationOptionsDto } from './installation-options.dto';
import { IntegrationServiceDto } from './integration-service.dto';
import { PackageTypeDto } from './package-type.dto';

export class CreateIntegrationDto {

  @ApiProperty()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsNotEmpty()
  public category: string;

  @ApiProperty()
  @IsOptional()
  public categoryIcon?: string;

  @ApiProperty()
  public displayOptions: DisplayOptionsDto;

  @ApiProperty()
  public installationOptions: InstallationOptionsDto;

  @ApiProperty()
  public flatAmount: number;

  @ApiProperty()
  public handlingFeePercentage: number;

  @ApiProperty()
  @IsOptional()
  public integrationServices?: IntegrationServiceDto[];

  @ApiProperty()
  @IsOptional()
  public packageTypes?: PackageTypeDto[];
}
