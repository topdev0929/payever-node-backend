import { IsString, IsNotEmpty } from 'class-validator';

export class CheckoutPaymentFlowDto {
  @IsString()
  @IsNotEmpty()
  public id: string;
}
