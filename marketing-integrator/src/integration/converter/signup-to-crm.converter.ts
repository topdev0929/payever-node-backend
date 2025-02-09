import { BaseCrmContactCustomerStatus, BaseCrmContactInterface, BaseCrmContactProspectStatus } from '../../base-crm';
import { SignupModel } from '../../signups';

export class SignupToCrmConverter {
  public static convert(signup: SignupModel): BaseCrmContactInterface {
    const namePieces: string[] = signup.full_name.trim().split(' ');
    const firstName: string = namePieces.shift();
    const lastName: string = namePieces.join(' ');

    const contact: BaseCrmContactInterface = {
      custom_fields: {
        Apps: [signup.app],
        company: signup.business_name,
        countryCode: signup.country_code,
        revenue: signup.pricing,
      },
      customer_status: BaseCrmContactCustomerStatus.None,
      prospect_status: BaseCrmContactProspectStatus.None,

      email: signup.email,
      first_name: firstName || signup.full_name,
      last_name: lastName || signup.full_name,
      phone: signup.phone,
      website: signup.website_url,
    };

    let description: string = '';
    for (const field of Object.keys(contact.custom_fields)) {
      if (contact.custom_fields[field]) {
        description += `${field}: ${contact.custom_fields[field]},\n`;
      }
    }

    contact.description = description;

    return contact;
  }
}
