import { UserTokenInterface } from '@pe/nest-kit';

import { AbstractMessaging } from '../submodules/platform';

export interface GetMessagingMembersFilterContextInterface {
  chat: AbstractMessaging;
  user: UserTokenInterface;
}
