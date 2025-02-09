import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DisplayOptionsDto } from './display-options.dto';
import { InstallationOptionsDto } from './installation-options.dto';

export class AdminIntegrationDto {
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
  @IsOptional()
  @ValidateNested()
  @Type(() => DisplayOptionsDto)
  public displayOptions: DisplayOptionsDto;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => InstallationOptionsDto)
  public installationOptions: InstallationOptionsDto;
}
