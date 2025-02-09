export class TransactionHistoryDto {
  public action: string;
  public created_at: Date;
  public refund_items?: any[];
  public upload_items?: any[];
  public amount: number;
  public delivery_fee?: number;
  public payment_status: string;
  public psp_status?: string;
  public requirements_state?: string;
  public params?: any;
  public reason?: string;
  public is_restock_items?: boolean;
  public user?: any;
  public reference?: string;
}
