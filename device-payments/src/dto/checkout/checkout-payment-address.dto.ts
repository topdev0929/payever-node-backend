import { IsString, IsEmail } from 'class-validator';

export class CheckoutPaymentAddressDto {
  @IsString()
  public first_name: string;

  @IsString()
  public last_name: string;

  @IsEmail()
  public email: string;

  @IsString()
  public country: string;

  @IsString()
  public city: string;

  @IsString()
  public zip_code: string;

  @IsString()
  public street: string;

  @IsString()
  public phone: string;
}
