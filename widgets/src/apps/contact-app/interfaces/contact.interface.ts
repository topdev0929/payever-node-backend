import { ContactFieldInterface } from './contact-fields.interface';

export interface ContactInterface {
  _id?: string;
  id?: string;
  fields?: ContactFieldInterface[];
  businessId: string;
}
