import { CompanyAddressInterface } from './company-address.interface';

export interface BusinessDetailInterface extends Document {
  companyAddress: CompanyAddressInterface;
}
