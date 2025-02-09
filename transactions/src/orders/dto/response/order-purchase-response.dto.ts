import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class OrderPurchaseResponseDto {
  @Expose()
  public amount: number;

  @Expose()
  public currency: string;

  @Expose()
  public delivery_fee: number;

  @Expose()
  public down_payment: number;
}
