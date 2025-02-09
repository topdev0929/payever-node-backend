import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CheckoutCartDto } from './checkout-cart.dto';

export class CheckoutFlowDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => CheckoutCartDto)
  public cart: CheckoutCartDto;
}
