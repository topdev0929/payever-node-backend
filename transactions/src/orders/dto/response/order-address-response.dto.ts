import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OrderAddressResponseDto {
  @Expose()
  public city: string;

  @Expose()
  public country: string;

  @Expose()
  public first_name: string;

  @Expose()
  public last_name: string;

  @Expose()
  public salutation?: string;

  @Expose()
  public street: string;

  @Expose()
  public street_number?: string;

  @Expose()
  public street_name?: string;

  @Expose()
  public house_extension?: string;

  @Expose()
  public zip: string;

  @Expose()
  public street_line_2?: string;

  @Expose()
  public region?: string;

  @Expose()
  public organization_name?: string;
}
