import { ContactInterface } from '../interfaces';
import { ContactFieldInterface } from '../interfaces/contact-fields.interface';

export class ContactEventDto {
  public contact: ContactInterface;
  public fields: ContactFieldInterface[];
}
