import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { CheckoutCartItemDto } from './checkout-cart-item.dto';

export class CheckoutCartDto {
  @ValidateNested({ each: true })
  public items: CheckoutCartItemDto[];

  @IsString()
  @IsOptional()
  public order: string;
}
