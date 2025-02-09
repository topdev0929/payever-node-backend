import { Exclude, Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

@Exclude()
export class PaymentShippingOptionAddressDto {
  @IsOptional()
  @Expose()
  public salutation?: string;

  @IsOptional()
  @Expose()
  public first_name?: string;

  @IsOptional()
  @Expose()
  public last_name?: string;

  @IsOptional()
  @Expose()
  public street?: string;

  @IsOptional()
  @Expose()
  public street_number?: string;

  @IsOptional()
  @Expose()
  public zip?: string;

  @IsOptional()
  @Expose()
  public country?: string;

  @IsOptional()
  @Expose()
  public region?: string;

  @IsOptional()
  @Expose()
  public city?: string;

  @IsOptional()
  @Expose()
  public organization_name?: string;

  @IsOptional()
  @Expose()
  public street_line_2?: string;

  @IsOptional()
  @Expose()
  public street_name?: string;

  @IsOptional()
  @Expose()
  public house_extension?: string;
}
