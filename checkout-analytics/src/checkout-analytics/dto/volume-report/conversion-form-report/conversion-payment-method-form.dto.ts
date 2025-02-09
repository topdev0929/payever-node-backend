import { IsNumber, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ConversionPaymentMethodFormDto {
  @IsString()
  @Expose()
  public name: string;

  @IsNumber()
  @Expose()
  public count: number;

  @IsNumber()
  @Expose()
  public percent: number;
}
