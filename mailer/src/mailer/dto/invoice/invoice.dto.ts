import { InvoiceCustomerDto } from './invoice-customer.dto';
import { InvoiceItemDto } from './invoice-item.dto';

export class InvoiceDto {
  public invoiceId: string;
  public transactionId: string;
  public reference: string;
  public businessId: string;
  public invoiceItems: InvoiceItemDto[];
  public currency: string;
  public subtotal?: number;
  public total: number;
  public vatRate?: number;
  public paymentMethod: string;
  public collectionMethod?: string;
  public status: string;
  public amountDue?: number;
  public amountRemaining?: number;
  public amountPaid: number;
  public issueDate?: Date;
  public dueDate?: Date;

  public customer: InvoiceCustomerDto;

  public paymentCredentials: [];
  public paymentDescription: string;
}
