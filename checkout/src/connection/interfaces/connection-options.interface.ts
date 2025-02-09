export interface ConnectionOptionsInterface {
  acceptFee?: boolean;
  countryLimits?: string[];
  default?: boolean;
  minAmount?: number;
  maxAmount?: number;
  sortOrder?: number;
  shippingAddressAllowed?: boolean;
  shippingAddressEquality?: boolean;
  useDefaultVariant?: boolean;
  version?: string;
}
