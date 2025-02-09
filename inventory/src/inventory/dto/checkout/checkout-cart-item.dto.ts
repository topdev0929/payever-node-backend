import { IsNumber, IsOptional, IsString } from 'class-validator';

/**
 * This DTO presents checkout item in format of PaymentFlow from Checkout application
 */
export class CheckoutCartItemDto {
  @IsString()
  public id: string;

  @IsString()
  @IsOptional()
  public product_uuid: string;

  @IsString()
  @IsOptional()
  public identifier: string;

  @IsNumber()
  public quantity: number;
}
