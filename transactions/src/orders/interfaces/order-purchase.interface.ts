export interface OrderPurchaseInterface {
  amount: number;
  currency: string;
  delivery_fee?: number;
  down_payment?: number;
}
