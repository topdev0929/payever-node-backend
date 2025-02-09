
export interface UserAccountInterface {
  readonly language?: string;
  readonly salutation?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly email?: string;
  readonly birthday?: string;
  readonly createdAt?: string;
  readonly logo?: string;
  readonly shippingAddresses?: ShippingAddressInterface[];
}

export interface ShippingAddressInterface {
  country: string;
  city: string;
  street: string;
  zipCode: string;
  apartment?: string;
}
