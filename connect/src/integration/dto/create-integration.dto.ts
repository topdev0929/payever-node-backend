import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { DisplayOptionsDto } from './display-options.dto';
import { InstallationOptionsDto } from './installation-options.dto';

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
}
