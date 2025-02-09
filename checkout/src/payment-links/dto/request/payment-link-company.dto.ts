import { CreatePaymentCompanyInterface, CompanyTypeEnum } from '../../../legacy-api';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';

@Exclude()
export class PaymentLinkCompanyDto implements CreatePaymentCompanyInterface{
  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsEnum(CompanyTypeEnum)
  public type?: CompanyTypeEnum;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public name?: string;

  @Expose( { name: 'registrationNumber'})
  @ApiProperty({ required: false, name: 'registrationNumber'})
  @IsOptional()
  @IsString()
  public registration_number?: string;

  @Expose( { name: 'registrationLocation'})
  @ApiProperty({ required: false, name: 'registrationLocation'})
  @IsOptional()
  @IsString()
  public registration_location?: string;

  @Expose( { name: 'taxId'})
  @ApiProperty({ required: false, name: 'taxId'})
  @IsOptional()
  @IsString()
  public tax_id?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public homepage?: string;

  @Expose( { name: 'externalId'})
  @ApiProperty({ required: false, name: 'externalId'})
  @IsOptional()
  @IsString()
  public external_id?: string;
}
