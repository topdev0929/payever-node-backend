export interface ExportMonthlyUserPerBusinessTransactionDto {
  businessId: string;
  currency: string;
  date: string;
  totalSpent: number;
  transactions: number;
  userId: string;
}
