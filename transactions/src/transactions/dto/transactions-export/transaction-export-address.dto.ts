import { IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TransactionExportAddressDto {
  @IsString()
  @Expose()
  public city: string;

  @IsString()
  @Expose()
  public country: string;

  @IsString()
  @Expose()
  public country_name: string;

  @IsString()
  @Expose()
  public street: string;

  @IsString()
  @Expose()
  public zip_code: string;

  @IsString()
  @Expose()
  public first_name: string;

  @IsString()
  @Expose()
  public last_name: string;

  @IsString()
  @Expose()
  public salutation: string;

  @IsString()
  @Expose()
  public phone: string;

  @IsString()
  @Expose()
  public email: string;
}
