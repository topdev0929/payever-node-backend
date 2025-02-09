import { IsNotEmpty, IsString } from 'class-validator';

export class PaymentEventAddressDto {
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
  public street: string;

  @IsNotEmpty()
  @IsString()
  public zip_code: string;
}
