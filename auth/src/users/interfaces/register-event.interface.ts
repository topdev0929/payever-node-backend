import { TokensResultModel, UserTokenInterface } from '@pe/nest-kit';

import { RequestFingerprint } from '../../auth/interfaces';
import { RegisterDto } from '../dto';

export interface RegisterEvent {
  user?: UserTokenInterface;
  parsedRequest: RequestFingerprint;
  registerDto: RegisterDto;
  isValid: boolean;
  isInvitedEmployee: boolean;

  response?: TokensResultModel;
  bulkEventId?: string;
  isRpc?: boolean;
}
