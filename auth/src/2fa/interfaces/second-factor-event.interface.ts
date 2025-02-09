import { TokensResultModel } from '@pe/nest-kit';
import { User } from '../../users/interfaces';
import { RequestFingerprint } from '../../auth';

export interface SecondFactorEvent {
  user?: User;
  success: boolean;
  parsedRequest: RequestFingerprint;
  response?: TokensResultModel;
}
