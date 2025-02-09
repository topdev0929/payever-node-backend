export class InvoiceDto {

  public invoiceId?: string;
  public transactionId: string;

  public business?: string;
  public businessId: string;
  public channelSet: string[];

  public currency: string;
  public subtotal?: number;
  public total: number;

  public amountDue?: number;
  public amountRemaining?: number;
  public amountPaid: number;
  public issueDate?: Date;
  public dueDate?: Date;   

  public customer: {
    email: string;
    name: string;
  };

  public updatedAt: string;

}
