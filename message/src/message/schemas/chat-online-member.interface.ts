import { ContactInterface } from '@pe/message-kit';
import { ChatUserAccountInterface } from '.';


export interface ChatOnlineMemberInterface {
  connectionId?: string;
  lastActivity?: Date;  
  contactId?: string; 
  user?: string;   
  contact?: ContactInterface;
  userAccount?: ChatUserAccountInterface;
}
