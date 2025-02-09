import { MessageResponseInterface } from './message-response.interface';

export interface BusinessContactsDataResponseInterface extends MessageResponseInterface {
  id: string;
  contactsCount?: number;
  groupsCount?: number;
}
