
export interface MailchimpContactInterface {
  id?: string;
  email_address: string;
  status: 'subscribed' | 'unsubscribed' | 'pending';
  merge_fields: {
    LNAME: string;
    FNAME: string;
  };
}
