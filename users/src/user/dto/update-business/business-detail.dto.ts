import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CompanyAddressDto } from './company-address.dto';
import { CompanyDetailsDto } from './company-details.dto';
import { ContactDetailsDto } from './contact-details.dto';
import { BankAccountDto } from './bank-account.dto';

export class BusinessDetailDto {
  @ApiProperty()
  @Type(() => CompanyAddressDto)
  @ValidateNested()
  @IsOptional()
  public companyAddress: CompanyAddressDto;

  @ApiProperty()
  @Type(() => CompanyDetailsDto)
  @ValidateNested()
  @IsOptional()
  public companyDetails: CompanyDetailsDto;

  @ApiProperty()
  @Type(() => ContactDetailsDto)
  @ValidateNested()
  @IsOptional()
  public contactDetails: ContactDetailsDto;

  @ApiProperty()
  @Type(() => BankAccountDto)
  @ValidateNested()
  @IsOptional()
  public bankAccount: BankAccountDto;
}
