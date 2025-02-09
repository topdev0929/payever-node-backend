import { PaymentOptionTypesEnum } from '../enums';
import { IsString, IsNotEmpty } from 'class-validator';

export class PaymentOptionDto {
  @IsString()
  @IsNotEmpty()
  public type: PaymentOptionTypesEnum;
}
