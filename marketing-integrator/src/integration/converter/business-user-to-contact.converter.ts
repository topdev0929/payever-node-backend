import { CompanyAddressInterface, CompanyDetailsInterface } from '@pe/business-kit';
import { BaseCrmContactInterface } from '../../base-crm/interfaces';
import { BaseCrmContactCustomerStatus, BaseCrmContactProspectStatus, BaseCrmCustomFieldsEnum } from '../../base-crm/enum';
import { UserInterface } from '../interfaces';
import { capitalize, translate } from '../helpers';

export class BusinessUserToContactConverter {
  public static convert(user: UserInterface, apps: string[]): BaseCrmContactInterface {
    let companyAddress: CompanyAddressInterface = {
      city: '',
      country: '',
      street: '',
      zipCode: '',
    };
    let companyDetails: CompanyDetailsInterface = {
      businessStatus: '',
      employeesRange: { },
      industry: '',
      legalForm: '',
      product: '',
      salesRange: { },
      urlWebsite: '',
    };
    const businessNames: string[] = [];
    const products: string[] = [];

    for (const business of user.businesses) {
      businessNames.push(business.name);

      if (business.companyDetails.product && !products.includes(business.companyDetails.product)) {
        products.push(business.companyDetails.product);
      }

      if (business.companyAddress && !companyAddress.country) {
        companyAddress = business.companyAddress;
      }
      if (business.companyDetails && !companyDetails.industry) {
        companyDetails = business.companyDetails;
      }
    }

    return {
      address: {
        city: companyAddress.city,
        country: companyAddress.country,
        line1: companyAddress.street,
        postal_code: companyAddress.zipCode,
        state: '',
      },
      custom_fields: {
        [BaseCrmCustomFieldsEnum.Apps]: apps.map(capitalize),
        [BaseCrmCustomFieldsEnum.BusinessName]: businessNames.join('\n'),
        [BaseCrmCustomFieldsEnum.Registered]: 'Yes',
        [BaseCrmCustomFieldsEnum.Product]: products.map(translate),
      },
      customer_status: BaseCrmContactCustomerStatus.None,
      prospect_status: BaseCrmContactProspectStatus.None,

      email: user.userAccount.email,
      first_name: user.userAccount.firstName,
      industry: translate(companyDetails.industry),
      last_name: user.userAccount.lastName,
      phone: companyDetails.phone,
      website: companyDetails.urlWebsite,
    };
  }
}
