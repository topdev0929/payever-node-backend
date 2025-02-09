import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

import { CompanyAddressDto } from './company-address.dto';
import { CurrentWallpaperDto } from './current-wallpaper.dto';

export class BusinessOnboardingDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public defaultLanguage?: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public logo?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public currency: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public active: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public hidden: boolean;

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  public contactEmails: string[];

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  public cspAllowedHosts: string[];

  @ApiProperty()
  @Type(() => CurrentWallpaperDto)
  @ValidateNested()
  @IsOptional()
  public currentWallpaper?: CurrentWallpaperDto;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CompanyAddressDto)
  public company_address: CompanyAddressDto;
}
