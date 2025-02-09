import { IsNumber } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ResponseTimeStateDto {
  @IsNumber()
  @Expose()
  public paymentCreate: number;

  @IsNumber()
  @Expose()
  public cancel: number;

  @IsNumber()
  @Expose()
  public refund: number;

  @IsNumber()
  @Expose()
  public shippingGoods: number;

  @IsNumber()
  @Expose()
  public oauthToken: number;
}
