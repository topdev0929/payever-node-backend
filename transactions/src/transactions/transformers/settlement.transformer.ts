/* tslint:disable:object-literal-sort-keys */
import { PspSettlementReportDto, CommonSettlementReportDto } from '../dto/settlement';
import { TransactionSettlementReportInterface } from '../interfaces';

export class SettlementTransformer {
  public static pspSettlementReportToCommonSettlementDto(
    pspReport: PspSettlementReportDto,
  ): CommonSettlementReportDto {
    return {
      transaction_id: pspReport.paymentId,
      order_id: pspReport.merchantOrderId,
      psp_reference_id: pspReport.pspReferenceId,
      bank_reference_id: pspReport.bankReferenceId,
      initiation_date: pspReport.initiationDate,
      business_name: pspReport.businessName,
      business_id: pspReport.businessId,
      customer_email: pspReport.customerEmail,
      customer_name: pspReport.customerName,
      transaction_credit_debit: pspReport.transactionCreditDebit,
      operation_type: pspReport.operationType,
      execution_date: pspReport.executionDate,
      gross_amount: pspReport.grossAmount,
      net_amount: pspReport.netAmount,
      payment_fee_credit_debit: pspReport.paymentFeeCreditDebit,
      payment_fee: pspReport.paymentFee,
      transaction_fee: pspReport.transactionFee,
      currency: pspReport.currency,
      billing_country: pspReport.billingCountry,
      billing_city: pspReport.billingCity,
      billing_street: pspReport.billingStreet,
      shipping_country: pspReport.shippingCountry,
      shipping_city: pspReport.shippingCity,
      shipping_street: pspReport.shippingStreet,
    };
  }

  public static internalSettlementReportToCommonSettlementDto(
    internalReport: TransactionSettlementReportInterface,
  ): CommonSettlementReportDto {
    return {
      transaction_id: internalReport.original_id,
      order_id: internalReport.reference,
      initiation_date: internalReport.created_at,
      business_name: internalReport.business.name,
      business_id: internalReport.business_uuid,
      customer_email: internalReport.customer_email,
      customer_name: internalReport.customer_name,
      execution_date: internalReport.created_at,
      net_amount: internalReport.total,
      transaction_fee: internalReport.delivery_fee,
      currency: internalReport.currency,
      billing_country: internalReport.billing_address.country,
      billing_city: internalReport.billing_address.city,
      billing_street: internalReport.billing_address.street,
      shipping_country: internalReport.shipping_address?.country,
      shipping_city: internalReport.shipping_address?.city,
      shipping_street: internalReport.shipping_address?.street,
    };
  }
}
