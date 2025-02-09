import { InvoiceCustomerAddressDto } from './invoice-customer-address.dto';

export class InvoiceCustomerDto {
  public billingAddress: InvoiceCustomerAddressDto;
  public shippingAddress?: InvoiceCustomerAddressDto;
  public businessId: string;
  public contactId?: string;
  public email: string;
  public name: string;
  public taxExempt?: string;
  public taxId?: string;
}
