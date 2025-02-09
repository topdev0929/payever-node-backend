import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

@Exclude()
export class OrderPurchaseIncomingDto {
  @ApiProperty()
  @IsNumber()
  @Expose()
  public amount: number;

  @ApiProperty()
  @IsString()
  @Expose()
  public currency: string;

  @ApiProperty()
  @IsNumber()
  @Expose()
  public delivery_fee: number;

  @ApiProperty()
  @IsNumber()
  @Expose()
  public down_payment: number;
}
