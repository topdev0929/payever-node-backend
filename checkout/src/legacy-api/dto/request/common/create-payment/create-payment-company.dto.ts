import { CompanyTypeEnum } from '../../../../enum';
import { CreatePaymentCompanyInterface } from '../../../../interfaces';

export class CreatePaymentCompanyDto implements CreatePaymentCompanyInterface{
  public type?: CompanyTypeEnum;
  public name?: string;
  public registration_number?: string;
  public registration_location?: string;
  public tax_id?: string;
  public homepage?: string;
  public external_id?: string;
}
