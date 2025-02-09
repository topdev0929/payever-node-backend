import { ApiCallAddressInterface } from '../../../../../common/interfaces';

export class CreatePaymentAddressDto implements ApiCallAddressInterface {
  public salutation?: string;
  public first_name?: string;
  public last_name?: string;
  public street?: string;
  public street_number?: string;
  public zip?: string;
  public country?: string;
  public region?: string;
  public city?: string;
  public address_line_2?: string;

  public organization_name?: string;
  public street_line_2?: string;
  public street_name?: string;
  public house_extension?: string;
}
