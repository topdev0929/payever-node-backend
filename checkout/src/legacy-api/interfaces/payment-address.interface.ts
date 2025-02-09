export interface PaymentAddressInterface {
  readonly uuid?: string;
  readonly address_line_2?: string;
  readonly city: string;
  readonly country: string;
  readonly country_name?: string;
  readonly email?: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly phone?: string;
  readonly salutation: string;
  readonly street: string;
  readonly street_number?: string;
  readonly zip_code: string;
  readonly region?: string;
}
