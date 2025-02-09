import { CompanyTypeEnum } from '../../../legacy-api/enum';

export interface ApiCallCompanyInterface {
  type?: CompanyTypeEnum;
  name?: string;
  registration_number?: string;
  registration_location?: string;
  tax_id?: string;
  homepage?: string;
  external_id?: string;
}
