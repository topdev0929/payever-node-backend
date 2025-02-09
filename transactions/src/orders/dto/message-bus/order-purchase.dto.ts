import { IsNumber, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OrderPurchaseDto {
  @IsNumber()
  @Expose()
  public amount: number;

  @IsString()
  @Expose()
  public currency: string;

  @IsNumber()
  @Expose()
  public delivery_fee: number;

  @IsNumber()
  @Expose()
  public down_payment: number;
}
