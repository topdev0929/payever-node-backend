import { IsString, IsOptional } from 'class-validator';

export class ShippingDto {
  @IsString()
  @IsOptional()
  public order_id?: string;
}
