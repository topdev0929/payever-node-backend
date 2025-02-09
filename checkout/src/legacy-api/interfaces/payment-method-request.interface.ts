import { PaymentMethodAddressRequestInterface } from './payment-method-address-request.interface';
import { PaymentMethodSortingRequestInterface } from './payment-method-sorting-request.interface';

export interface PaymentMethodRequestInterface {
  channel: string;
  currency?: string;
  businessId?: string;
  amount?: number;
  country?: string;
  locale?: string;
  billingAddress?: PaymentMethodAddressRequestInterface;
  shippingAddress?: PaymentMethodAddressRequestInterface;
  blockedPaymentMethods?: string[];
  sorting?: PaymentMethodSortingRequestInterface;
}
