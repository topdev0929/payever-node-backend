import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePaymentAddressDto {
  @IsNotEmpty()
  @IsString()
  public uuid: string;

  @IsNotEmpty()
  @IsString()
  public city: string;

  @IsNotEmpty()
  @IsString()
  public country: string;

  @IsNotEmpty()
  @IsString()
  public country_name: string;

  @IsNotEmpty()
  @IsString()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public first_name: string;

  @IsNotEmpty()
  @IsString()
  public last_name: string;

  @IsNotEmpty()
  @IsString()
  public phone: string;

  @IsNotEmpty()
  @IsString()
  public salutation: string;

  @IsNotEmpty()
  @IsString()
  public street: string;

  @IsNotEmpty()
  @IsString()
  public zip_code: string;

  @IsOptional()
  @IsString()
  public region?: string;
}
