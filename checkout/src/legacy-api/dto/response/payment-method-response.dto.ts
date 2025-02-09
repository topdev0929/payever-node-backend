import { PaymentMethodOptionsResponseDto } from './payment-method-options-response.dto';
import { PaymentMethodVariantDto } from './payment-method-variant.dto';

export class PaymentMethodResponseDto {
  public name: string;
  public payment_issuer?: string;
  public payment_method: string;
  public description: string;
  public logo: string;
  public min: number;
  public max: number;
  public countries?: string[];
  public currencies?: string[];
  public options: PaymentMethodOptionsResponseDto;
  public variants?: PaymentMethodVariantDto[];
}
