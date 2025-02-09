import { ApiProperty } from '@nestjs/swagger';
import { IsCurrencyCode } from '@pe/common-sdk';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested, IsEnum } from 'class-validator';
import { BankAccountDto } from './bank-account.dto';
import { CompanyAddressDto } from './company-address.dto';
import { CompanyDetailsDto } from './company-details.dto';
import { ContactDetailsDto } from './contact-details.dto';
import { TrafficSourceDto } from './traffic-source.dto';
import { TaxesDto } from './taxes.dto';
import { CurrentWallpaperDto } from '../wallpaper';
import { CurrencyFormatEnum } from '../../../user/enums';

export class BaseBusinessDto {
  @ApiProperty()
  @IsString()
  @IsUUID('4')
  @IsNotEmpty()
  public id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public logo: string;

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
  @IsOptional()
  @Type(() => CompanyAddressDto)
  @ValidateNested()
  public companyAddress: CompanyAddressDto;

  @ApiProperty()
  @IsOptional()
  @Type(() => CompanyDetailsDto)
  @ValidateNested()
  public companyDetails: CompanyDetailsDto;

  @ApiProperty()
  @Type(() => ContactDetailsDto)
  @ValidateNested()
  @IsNotEmpty()
  public contactDetails: ContactDetailsDto;

  @ApiProperty()
  @Type(() => BankAccountDto)
  @ValidateNested()
  @IsOptional()
  public bankAccount: BankAccountDto;

  @ApiProperty()
  @Type(() => TaxesDto)
  @ValidateNested()
  @IsOptional()
  public taxes: TaxesDto;

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

  @ApiProperty()
  @IsString()
  @IsOptional()
  public defaultLanguage?: string;

  @ApiProperty()
  @Type(() => TrafficSourceDto)
  @ValidateNested()
  @IsOptional()
  public trafficSource: TrafficSourceDto;

  @ApiProperty()
  @Type(() => CurrentWallpaperDto)
  @ValidateNested()
  @IsOptional()
  public currentWallpaper?: CurrentWallpaperDto;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public registrationOrigin?: string;
}

export type BusinessDto = BaseBusinessDto & {
  [key: string]: string;
};
