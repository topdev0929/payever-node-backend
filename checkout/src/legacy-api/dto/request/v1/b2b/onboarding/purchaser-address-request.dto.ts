import { IsNotEmpty, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PurchaserAddressRequestDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  public street_name: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  public street_number: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  public country: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  public city: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  public zip: string;
}
