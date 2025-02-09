import { Allow, IsString, IsNotEmpty, IsOptional, ValidateNested, IsUUID } from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { CompanyAddressDto, CompanyDetailsDto, ContactDetailsDto, BankAccountDto, TaxesDto } from './business';
import { UserDto } from './business/user.dto';

export class BusinessDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public uuid: string;

  @IsOptional()
  @IsString()
  public slug: string;

  @IsOptional()
  @IsString()
  public name: string;

  @IsString()
  @IsOptional()
  public currency: string;

  @IsOptional()
  @Type(() => CompanyAddressDto)
  @ValidateNested()
  @Expose({ name: 'address' })
  public companyAddress: CompanyAddressDto;

  @IsOptional()
  @Type(() => CompanyDetailsDto)
  @ValidateNested()
  public companyDetails: CompanyDetailsDto;

  @Type(() => ContactDetailsDto)
  @ValidateNested()
  @IsOptional()
  public contactDetails: ContactDetailsDto;

  @Type(() => BankAccountDto)
  @ValidateNested()
  @IsOptional()
  public bankAccount: BankAccountDto;

  @Type(() => UserDto)
  @ValidateNested()
  @IsOptional()
  public user: UserDto;

  @Allow()
  public user_full_name: string;

  @Type(() => TaxesDto)
  @ValidateNested()
  @IsOptional()
  public taxes: TaxesDto;

  @IsString({ each: true })
  @IsOptional()
  public contactEmails: string[];

  @IsString({ each: true })
  @IsOptional()
  public cspAllowedHosts: string[];

  @IsString()
  @IsOptional()
  public createdAt?: string;
}
