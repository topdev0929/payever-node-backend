export class TransactionFoldersIndexDto {
  public id: string;
  public uuid: string;
  public original_id: string;
  public reference: string;
  public created_at: Date;
  public type: string;
  public status: string;
  public specific_status: string;
  public channel: string;
  public total_left: number;
  public currency: string;
  public customer_name: string;
  public customer_email: string;
  public customer_psp_id: string;
  public merchant_name: string;
  public merchant_email: string;
  public seller_name?: string;
  public seller_email?: string;
  public seller_id?: string;
  public example?: boolean;
  public channel_source?: string;
  public plugin_version?: string;
  public channel_type?: string;
  public item_thumbnail?: string;
  public anonymized?: boolean;
}
