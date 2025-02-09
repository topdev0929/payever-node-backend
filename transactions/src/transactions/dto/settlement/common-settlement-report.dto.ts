import { SettlementOperationTypeEnum } from '../../enum';

export class CommonSettlementReportDto {
  public transaction_id: string;
  public order_id: string;
  public psp_reference_id?: string;
  public bank_reference_id?: string;
  public initiation_date?: Date;
  public business_name: string;
  public business_id: string;
  public customer_email: string;
  public customer_name: string;
  public transaction_credit_debit?: string;
  public operation_type?: SettlementOperationTypeEnum;
  public execution_date?: Date;
  public gross_amount?: number;
  public net_amount?: number;
  public payment_fee_credit_debit?: string;
  public payment_fee?: number;
  public transaction_fee?: number;
  public currency: string;
  public billing_country: string;
  public billing_city: string;
  public billing_street: string;
  public shipping_country?: string;
  public shipping_city?: string;
  public shipping_street?: string;
}
