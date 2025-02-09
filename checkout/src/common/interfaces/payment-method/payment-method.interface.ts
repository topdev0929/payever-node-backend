import { PaymentMethodLimitsInterface } from './payment-method-limits.interface';
import { PaymentMethodOptionsInterface } from './payment-method-options.interface';

export interface PaymentMethodInterface {
  readonly accept_fee?: boolean;
  description_fee: string;
  description_offer: string;
  readonly fixed_fee: number;
  readonly instruction_text: string;
  readonly merchant_allowed_countries: string[];
  name: string;
  readonly options: PaymentMethodOptionsInterface;
  readonly amount_limits: PaymentMethodLimitsInterface;
  readonly payment_issuer?: string;
  readonly payment_method: string;
  readonly related_country?: string;
  readonly related_country_name?: string;
  readonly status: string;
  readonly is_redirect_method?: boolean;
  readonly is_submit_method?: boolean;
  readonly is_b2b_method?: boolean;
  readonly thumbnail1: string;
  readonly thumbnail2: string;
  readonly variable_fee: number;
  readonly shipping_address_allowed: boolean;
  readonly shipping_address_equality: boolean;
  readonly rates: boolean;
  readonly share_bag_enabled: boolean;
  readonly organization_allowed?: boolean;
}
