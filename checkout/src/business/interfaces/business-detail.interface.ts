import { BankAccountInterface, CompanyAddressInterface } from '@pe/business-kit/modules';

export interface BusinessDetailInterface {
  bankAccount?: BankAccountInterface;
  companyAddress?: CompanyAddressInterface;
}
