import { UserTokenInterface } from '@pe/nest-kit';

export interface TaskOptionsInterface {
  accessToken: string;
  userAgent: string;
  user: UserTokenInterface;
}
