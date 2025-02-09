import { BaseCrmContactInterface } from '../../base-crm';
import { MailchimpContactInterface } from '../../mailchimp';

export class CrmToMailchimpConverter {
  public static convert(contact: BaseCrmContactInterface): MailchimpContactInterface {
    return {
      email_address: contact.email,
      merge_fields: {
        FNAME: contact.first_name,
        LNAME: contact.last_name,
      },
      status: 'subscribed',
    };
  }
}
