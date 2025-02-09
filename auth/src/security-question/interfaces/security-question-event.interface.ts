import { TokensResultModel } from '@pe/nest-kit';
import { User } from '../../users/interfaces';
import { RequestFingerprint } from '../../auth';
import { ValidateSecurityQuestionDto } from '../dto';

export interface SecurityQuestionEvent {
  user?: User;
  validateDto: ValidateSecurityQuestionDto;
  isValidAnswer: boolean;
  parsedRequest: RequestFingerprint;
  response?: TokensResultModel;
}
