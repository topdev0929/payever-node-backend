import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PaymentLinkPrivacyDto {
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public billing_address_salutation?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public billing_address_first_name?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public billing_address_last_name?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public billing_address_street?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public billing_address_street_number?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public billing_address_zip?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public billing_address_country?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public billing_address_region?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public billing_address_city?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public billing_address_address_line_2?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  public billing_address_organization_name?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  public billing_address_street_line_2?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  public billing_address_street_name?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  public billing_address_house_extension?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public shipping_address_salutation?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public shipping_address_first_name?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public shipping_address_last_name?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public shipping_address_street?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public shipping_address_street_number?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public shipping_address_zip?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public shipping_address_country?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public shipping_address_region?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public shipping_address_city?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public shipping_address_address_line_2?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  public shipping_address_organization_name?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  public shipping_address_street_line_2?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  public shipping_address_street_name?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()
  public shipping_address_house_extension?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public birthdate?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public phone?: string;
  
  @ApiProperty()
  @IsOptional()
  @IsString()  
  public email?: string;
  
}
