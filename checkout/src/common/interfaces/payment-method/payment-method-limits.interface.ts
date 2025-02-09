export interface PaymentMethodLimitsInterface {
  min: {
    [currency: string]: number;
  };
  max: {
    [currency: string]: number;
  };
}
