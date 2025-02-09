import { RegistrationMessageInterface } from '../../mailbox';
import { BaseCrmContactCustomerStatus, BaseCrmContactInterface, BaseCrmContactProspectStatus } from '../../base-crm';

export class MessageToCrmConverter {
  public static convert(message: RegistrationMessageInterface): BaseCrmContactInterface {
    const namePieces: string[] = message.contactName.trim().split(' ');
    const firstName: string = namePieces.shift();
    const lastName: string = namePieces.join(' ');

    const contact: BaseCrmContactInterface = {
      custom_fields: {
        Apps: [message.app],
        company: message.businessName,
        countryCode: message.countryCode,
        revenue: message.revenue,
      },
      customer_status: BaseCrmContactCustomerStatus.None,
      prospect_status: BaseCrmContactProspectStatus.None,

      email: message.email,
      first_name: firstName || message.contactName,
      last_name: lastName || message.contactName,
      phone: message.phone,
      website: message.website,
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
