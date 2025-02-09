import { ShippingOptionCategoryEnum } from '../../../legacy-api/enum';
import { ApiCallShippingOptionDetailsInterface } from './api-call-shipping-option-details.interface';

export interface ApiCallShippingOptionInterface {
  name?: string;
  carrier?: string;
  category?: ShippingOptionCategoryEnum;
  price?: number;
  tax_rate?: number;
  tax_amount?: number;
  details?: ApiCallShippingOptionDetailsInterface;
}
