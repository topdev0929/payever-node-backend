import { ContactInterface } from './contact.interface';

export interface GroupInterface {
  _id: string;
  businessId: string;
  name: string;
  isDefault: boolean;
  transactionsCount?: number;
  totalSpent?: number;
  contacts: ContactInterface[];
}
