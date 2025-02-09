import { PaymentLinkAddressInterface } from '../../interfaces';
import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class PaymentLinkAddressDto implements PaymentLinkAddressInterface {

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public salutation?: string;

  @Expose( { name: 'firstName'})
  @ApiProperty({ required: false, name: 'firstName'})
  @IsOptional()
  @IsString()
  public first_name?: string;

  @Expose( { name: 'lastName'})
  @ApiProperty({ required: false, name: 'lastName'})
  @IsOptional()
  @IsString()
  public last_name?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public street?: string;

  @Expose( { name: 'streetNumber'})
  @ApiProperty({ required: false, name: 'streetNumber'})
  @IsOptional()
  @IsString()
  public street_number?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public zip?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public country?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public region?: string;

  @Expose()
  @ApiProperty({ required: false})
  @IsOptional()
  @IsString()
  public city?: string;

  @Expose( { name: 'addressLine2'})
  @ApiProperty({ required: false, name: 'addressLine2'})
  @IsOptional()
  @IsString()
  public address_line_2?: string;


  @Expose( { name: 'organizationName'})
  @ApiProperty({ required: false, name: 'organizationName'})
  @IsOptional()
  @IsString()
  public organization_name?: string;

  @Expose( { name: 'streetName'})
  @ApiProperty({ required: false, name: 'streetName'})
  @IsOptional()
  @IsString()
  public street_name?: string;

  @Expose( { name: 'houseExtension'})
  @ApiProperty({ required: false, name: 'houseExtension'})
  @IsOptional()
  @IsString()
  public house_extension?: string;
}
