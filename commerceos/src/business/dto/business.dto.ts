import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { CompanyDetailsDto } from './company-details.dto';
import { ThemeSettingsDto } from './theme-settings.dto';

export class BusinessDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public _id: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CompanyDetailsDto)
  public companyDetails: CompanyDetailsDto;

  @ApiProperty()
  @IsOptional()
  public createdAt: string;

  @ValidateNested()
  @Type(() => ThemeSettingsDto)
  public themeSettings: ThemeSettingsDto;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public registrationOrigin?: string;

  @IsOptional()
  @IsString()
  public owner?: string;
}
