import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { PaymentAddressInterface } from '../../interfaces';


@Exclude()
export class PaymentAddressDto implements PaymentAddressInterface {
  @IsString()
  @Expose()
  public uuid?: string;

  @IsString()
  @Expose()
  public address_line_2?: string;

  @IsString()
  @Expose()
  public city: string;

  @IsString()
  @Expose()
  public region?: string;

  @IsString()
  @Expose()
  public country: string;

  @IsString()
  @Expose()
  public country_name?: string;

  @IsString()
  @Expose()
  public email?: string;

  @IsString()
  @Expose()
  public first_name: string;

  @IsString()
  @Expose()
  public last_name: string;

  @IsString()
  @Expose()
  public phone?: string;

  @IsString()
  @Expose()
  public salutation: string;

  @IsString()
  @Expose()
  public street: string;

  @IsString()
  @Expose()
  public street_number?: string;

  @IsString()
  @Expose()
  public zip_code: string;
}
