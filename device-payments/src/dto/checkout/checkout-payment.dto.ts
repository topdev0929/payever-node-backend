import {
  IsString,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CheckoutPaymentAddressDto } from './checkout-payment-address.dto';
import { CheckoutPaymentFlowDto } from './checkout-payment-flow.dto';

export class CheckoutPaymentDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsString()
  @IsNotEmpty()
  public uuid: string;

  @IsNumber()
  public total: number;

  @IsString()
  public payment_type: string;

  @ValidateNested()
  @Type(() => CheckoutPaymentAddressDto)
  public address: CheckoutPaymentAddressDto;

  @ValidateNested()
  @Type(() => CheckoutPaymentFlowDto)
  public payment_flow: CheckoutPaymentFlowDto;
}
