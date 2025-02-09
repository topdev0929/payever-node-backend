import {
  PaymentMethodInterface,
  PaymentMethodLimitsInterface,
  PaymentMethodOptionsInterface,
} from '../interfaces';

export class PaymentMethodConfigDto implements PaymentMethodInterface {
  public readonly accept_fee?: boolean;
  public readonly description_fee: string;
  public readonly description_offer: string;
  public readonly fixed_fee: number;
  public readonly instruction_text: string;
  public readonly merchant_allowed_countries: string[];
  public readonly name: string;
  public readonly options: PaymentMethodOptionsInterface;
  public readonly amount_limits: PaymentMethodLimitsInterface;
  public readonly payment_issuer?: string;
  public readonly payment_method: string;
  public readonly related_country?: string;
  public readonly related_country_name?: string;
  public readonly status: string;
  public readonly thumbnail1: string;
  public readonly thumbnail2: string;
  public readonly variable_fee: number;
  public readonly shipping_address_allowed: boolean;
  public readonly shipping_address_equality: boolean;
  public readonly rates: boolean;
  public readonly share_bag_enabled: boolean;
}
