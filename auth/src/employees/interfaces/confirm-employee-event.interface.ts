import { RequestFingerprint } from '../../auth';
import { User } from '../../users/interfaces';

export interface ConfirmEmployeeEvent {
  user?: User;
  parsedRequest: RequestFingerprint;
  recaptchaToken?: string;
}
