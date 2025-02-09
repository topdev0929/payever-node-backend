import { SettlementOperationTypeEnum } from '../../../enum';

export class PspSettlementReportDto {
  public paymentId: string;
  public merchantOrderId: string;
  public pspReferenceId?: string;
  public bankReferenceId?: string;
  public initiationDate: Date;
  public businessName: string;
  public businessId: string;
  public customerEmail: string;
  public customerName: string;
  public transactionCreditDebit?: string;
  public operationType: SettlementOperationTypeEnum;
  public executionDate: Date;
  public grossAmount: number;
  public netAmount: number;
  public paymentFeeCreditDebit?: string;
  public paymentFee: number;
  public transactionFee: number;
  public currency: string;
  public billingCountry: string;
  public billingCity: string;
  public billingStreet: string;
  public shippingCountry?: string;
  public shippingCity?: string;
  public shippingStreet?: string;
}
