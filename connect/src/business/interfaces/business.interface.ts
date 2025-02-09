import {
  BankAccountInterface,
  CompanyAddressInterface,
  CompanyDetailsInterface,
  ContactDetailsInterface,
  TaxesInterface,
  ThemeSettingsInterface,
} from '@pe/business-kit';

export interface BusinessInterface {
  active: boolean;
  bankAccount?: BankAccountInterface;
  companyAddress: CompanyAddressInterface;
  companyDetails?: CompanyDetailsInterface;
  contactDetails?: ContactDetailsInterface;
  country?: string;
  excludedIntegrations?: string[];
  taxes?: TaxesInterface;
  themeSettings?: ThemeSettingsInterface;
}
