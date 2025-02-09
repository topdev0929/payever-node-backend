import { IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OrderAddressDto {
  @IsString()
  @Expose()
  public salutation: string;

  @IsString()
  @Expose()
  public first_name: string;

  @IsString()
  @Expose()
  public last_name: string;

  @IsString()
  @Expose()
  public street: string;

  @IsString()
  @Expose()
  public street_number: string;

  @IsString()
  @Expose()
  public street_name: string;

  @IsString()
  @Expose()
  public house_extension: string;

  @IsString()
  @Expose()
  public city: string;

  @IsString()
  @Expose()
  public zip: string;

  @IsString()
  @Expose()
  public country: string;

  @IsString()
  @Expose()
  public street_line_2: string;

  @IsString()
  @Expose()
  public region: string;

  @IsString()
  @Expose()
  public organization_name: string;
}
