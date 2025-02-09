export interface CheckoutTransactionHistoryItemInterface {
  action: string;
  payment_status: string;
  amount: number;
  params?: { };
  reason?: string;
  created_at: string;
}
