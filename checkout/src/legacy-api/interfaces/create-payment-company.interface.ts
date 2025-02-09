import { CompanyTypeEnum } from '../enum';

export interface CreatePaymentCompanyInterface {
  type?: CompanyTypeEnum;
  name?: string;
  registration_number?: string;
  registration_location?: string;
  tax_id?: string;
  homepage?: string;
  external_id?: string;
}
