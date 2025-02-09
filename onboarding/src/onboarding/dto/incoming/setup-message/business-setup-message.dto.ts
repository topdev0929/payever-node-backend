import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsEnum,
  ValidateNested,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

import { BusinessPayloadInterface } from '../../../interfaces/incoming';
import { BankAccountMessageDto } from './bank-account-message.dto';
import { CompanyAddressMessageDto } from './company-address-mesage.dto';
import { CompanyDetailsMessageDto } from './company-details-message.dto';
import { TaxesAccountMessageDto } from './taxes-account-message.dto';
import { WallpaperMessagDto } from './wallpaper-message.dto';
import { USERS_APP_LANGUAGES } from '../../../enums';

export class BusinessSetupMessageDto implements BusinessPayloadInterface {
  @ApiProperty()
  @IsString()
  public name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public logo: string;

  @ApiProperty()
  @Type(() => CompanyAddressMessageDto)
  @ValidateNested()
  public companyAddress: CompanyAddressMessageDto;

  @ApiProperty()
  @Type(() => CompanyDetailsMessageDto)
  @ValidateNested()
  @IsNotEmpty()
  public companyDetails: CompanyDetailsMessageDto;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => BankAccountMessageDto)
  public bankAccount: BankAccountMessageDto;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => TaxesAccountMessageDto)
  public taxes: TaxesAccountMessageDto;

  @ApiProperty()
  @IsOptional()
  @IsEmail({ }, {
    each: true,
  })
  public contactEmails: string[];

  @ApiProperty()
  @IsOptional()
  @Transform((value: string) => value.toLowerCase())
  @IsEnum(USERS_APP_LANGUAGES)
  public defaultLanguage: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => WallpaperMessagDto)
  public currentWallpaper: WallpaperMessagDto;
}
