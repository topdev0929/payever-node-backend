import { TokensResultModel } from '@pe/nest-kit';

import { User } from '../../users/interfaces';
import { RequestFingerprint } from './request-fingerprint.interface';
import { LoginRequestDto } from '../dto';
import { Employee } from '../../employees/interfaces';
import { LoginEventResponseDto } from '../dto/login-event-response.dto';

export interface LoginEvent {
  employee?: Employee;
  user?: User;
  parsedRequest: RequestFingerprint;
  loginDto: LoginRequestDto;
  isValidPassword: boolean;
  isSecurityQuestionDefined: boolean;

  response?: LoginEventResponseDto;
}
