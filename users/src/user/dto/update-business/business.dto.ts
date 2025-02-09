import { ApiProperty } from '@nestjs/swagger';
import { IsCurrencyCode } from '@pe/common-sdk';
import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsNotEmpty, IsString, ValidateNested, IsEnum } from 'class-validator';
import { CompanyDocumentsDto } from './company-documents.dto';
import { TaxesDto } from './taxes.dto';
import { CurrentWallpaperDto } from '../wallpaper';
import { ThemeSettingsDto } from './theme-settings.dto';
import { BusinessDetailDto } from './business-detail.dto';
import { CurrencyFormatEnum } from '../../../user/enums';

export class BusinessDto {
  @IsNotEmpty({ message: '‘Business name’ field can`t be left empty.' })
  @ApiProperty()
  @IsString()
  @IsOptional()
  public name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public logo: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CurrentWallpaperDto)
  @IsOptional()
  public currentWallpaper?: CurrentWallpaperDto;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsCurrencyCode()
  public currency: string;

  @ApiProperty()
  @IsEnum(CurrencyFormatEnum)
  @IsOptional()
  public currencyFormat: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public active: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  public hidden: boolean;

  @ApiProperty()
  @Type(() => BusinessDetailDto)
  @ValidateNested()
  @IsOptional()
  public businessDetail: BusinessDetailDto;

  @ApiProperty()
  @Type(() => TaxesDto)
  @ValidateNested()
  @IsOptional()
  public taxes: TaxesDto;

  @ApiProperty()
  @Type(() => CompanyDocumentsDto)
  @ValidateNested()
  @IsOptional()
  public documents: CompanyDocumentsDto;

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  public contactEmails: string[];

  @ApiProperty()
  @IsString({ each: true })
  @IsOptional()
  public cspAllowedHosts: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  public createdAt?: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => ThemeSettingsDto)
  public themeSettings?: ThemeSettingsDto;
}
