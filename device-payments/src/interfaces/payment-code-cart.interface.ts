export interface PaymentCodeCartInterface {
  name: string;
  identifier?: string;
  sku?: string;
  price: number;
  vat?: number;
  quantity: number;
}
