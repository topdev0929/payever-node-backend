import { IsString, IsOptional } from 'class-validator';

export class PaymentFlowAddressDto {
  @IsString()
  @IsOptional()
  public salutation?: string;

  @IsString()
  @IsOptional()
  public first_name?: string;

  @IsString()
  @IsOptional()
  public last_name?: string;

  @IsString()
  @IsOptional()
  public email?: string;

  @IsString()
  @IsOptional()
  public country?: string;

  @IsString()
  @IsOptional()
  public city?: string;

  @IsString()
  @IsOptional()
  public zip_code?: string;

  @IsString()
  @IsOptional()
  public street?: string;

  @IsString()
  @IsOptional()
  public street_name?: string;

  @IsString()
  @IsOptional()
  public street_number?: string;

  @IsString()
  @IsOptional()
  public phone?: string;
}
