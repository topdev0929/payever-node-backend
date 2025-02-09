import { BankAccountInterface } from './bank-account.interface';
import { CompanyAddressInterface } from './company-address.interface';
import { CompanyDetailsInterface } from './company-details.interface';
import { ContactDetailsInterface } from './contact-details.interface';

export interface BusinessDetailInterface extends Document {
  bankAccount?: BankAccountInterface;
  companyAddress: CompanyAddressInterface;
  companyDetails?: CompanyDetailsInterface;
  contactDetails?: ContactDetailsInterface;
}
