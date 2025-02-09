import { UserTokenInterface } from '@pe/nest-kit';

export interface DecodedUserTokenInterface {
  user: UserTokenInterface;
}

export interface DecodedLiveChatTokenInterface {
  contactId: string;
}
