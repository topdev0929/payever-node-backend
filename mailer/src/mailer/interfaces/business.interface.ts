import { CompanyAddressInterface } from './company-address.interface';
import { CompanyDetailsInterface } from './company-details.interface';
import { ContactDetailsInterface } from './contact-details.interface';
import { UserInterface } from './user.interface';
import { Document } from 'mongoose';

export interface BusinessInterface extends Document {
  readonly _id: string;
  readonly name: string;
  readonly logo: string;
  readonly owner: UserInterface | string;
  readonly defaultLanguage: string;
  readonly companyDetails: CompanyDetailsInterface;
  readonly companyAddress: CompanyAddressInterface;
  readonly contactDetails: ContactDetailsInterface;
  readonly contactEmails: string[];
}
