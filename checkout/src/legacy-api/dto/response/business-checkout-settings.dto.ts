import { CheckoutLanguageInterface } from '../../../checkout';
import { CheckoutBusinessTypeEnum } from '../../../common';

export class BusinessCheckoutSettingsDto {
  public name: string;
  public type: CheckoutBusinessTypeEnum;
  public b2b_search: boolean;
  public languages: CheckoutLanguageInterface[];
  public company_address: {
    street: string;
    city: string;
    zip_code: string;
    country: string;
  };
  public testing_mode: boolean;
}
