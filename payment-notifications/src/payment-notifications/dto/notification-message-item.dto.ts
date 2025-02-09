import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

@Exclude()
export class NotificationMessageItemDto {
  @IsString()
  @Expose()
  public identifier: string;

  @IsNumber()
  @Expose()
  public price: number;

  @IsNumber()
  @Expose()
  public priceNet: number;

  @IsString()
  @Expose()
  public name: string;

  @IsNumber()
  @Expose()
  public quantity: number;

  @IsString()
  @Expose()
  public sku: string;

  @IsNumber()
  @Expose()
  public vatRate: number;
}
