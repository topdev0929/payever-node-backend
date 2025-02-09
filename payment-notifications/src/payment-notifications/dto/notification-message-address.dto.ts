import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';

@Exclude()
export class NotificationMessageAddressDto {
  @IsString()
  @Expose()
  public city: string;

  @IsString()
  @Expose()
  public country: string;

  @IsString()
  @Expose()
  public email: string;

  @IsString()
  @Expose()
  public first_name: string;

  @IsString()
  @Expose()
  public last_name: string;

  @IsString()
  @Expose()
  public phone: string;

  @IsString()
  @Expose()
  public salutation: string;

  @IsString()
  @Expose()
  public street: string;

  @IsString()
  @Expose()
  public zip_code: string;
}
