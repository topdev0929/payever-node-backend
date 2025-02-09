import { RequestFingerprint } from '../../auth';
import { ForgotPasswordDto } from '../dto';
import { User } from '../../users/interfaces';

export interface ForgotPasswordEvent {
  user?: User;
  parsedRequest: RequestFingerprint;
  forgotPasswordDto: ForgotPasswordDto;
}
