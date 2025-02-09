import { ShippingOptionCategoryEnum } from '../../../../enum';
import { CreatePaymentShippingOptionDetailsDto } from './create-payment-shipping-option-details.dto';

export class CreatePaymentShippingOptionDto {
  public name?: string;
  public carrier?: string;
  public category?: ShippingOptionCategoryEnum;
  public price?: number;
  public tax_rate?: number;
  public tax_amount?: number;
  public details?: CreatePaymentShippingOptionDetailsDto;
}
