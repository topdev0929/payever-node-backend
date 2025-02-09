export interface PaymentMethodAddressRequestInterface {
  firstName: string;
  lastName: string;
  street: string;
  streetNumber?: string;
  salutation?: string;
  zip: string;
  country: string;
  city: string;
  email?: string;
  phone?: string;
  region?: string;
}
