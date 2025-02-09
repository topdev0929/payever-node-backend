import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { LinkDto } from './link.dto';

export class InstallationOptionsDto {

  @ApiProperty()
  @IsOptional()
  @IsString()
  public optionIcon: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public price: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public links: LinkDto[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  public countryList: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  public category: string; // TODO Remove?

  @ApiProperty()
  @IsOptional()
  @IsString()
  public developer: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public languages: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public appSupport: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public website: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public pricingLink: string;
}
