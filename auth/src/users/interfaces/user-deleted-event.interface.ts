import { TokensResultModel, UserTokenInterface } from '@pe/nest-kit';
import { RequestFingerprint } from '../../auth/interfaces';

export interface UserDeletedEvent {
  user?: UserTokenInterface;
  parsedRequest: RequestFingerprint;

  response?: TokensResultModel;
  bulkEventId?: string;
}
