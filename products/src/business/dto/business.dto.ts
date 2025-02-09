import { IsString, IsNotEmpty, ValidateNested, IsDefined, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CompanyAddressDto } from './company-address.dto';
import { CompanyDetailsDto } from './company-details.dto';

export class BusinessDto {
  @IsString()
  @IsNotEmpty()
  public _id: string;
  
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ValidateNested()
  @IsDefined()
  @Type(() => CompanyAddressDto)
  public companyAddress: CompanyAddressDto;

  @ValidateNested()
  @IsDefined()
  @Type(() => CompanyDetailsDto)
  public companyDetails?: CompanyDetailsDto;

  @IsString()
  @IsNotEmpty()
  public currency: string;

  @IsString()
  @IsOptional()
  public defaultLanguage?: string;
}
