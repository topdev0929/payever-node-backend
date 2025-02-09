import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

import { DisplayOptionsDto } from './display-options.dto';
import { InstallationOptionsDto } from './installation-options.dto';
import { IntegrationConnectDto } from './integration-connect.dto';

export class IntegrationDto {
  @ApiProperty()
  @IsNotEmpty()
  public _id: string;

  @ApiProperty()
  @IsNotEmpty()
  public name: string;
  
  @ApiProperty()
  @IsOptional()
  public paymentMethod?: string;
  
  @ApiProperty()
  @IsOptional()
  public paymentIssuer?: string;
  
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
  public enabled: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  public scopes?: string[];

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  public connect?: IntegrationConnectDto;
}
