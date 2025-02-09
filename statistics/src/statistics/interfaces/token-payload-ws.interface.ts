import { UserTokenInterface } from '@pe/nest-kit';

export interface TokenPayloadWsInterface {
  result: boolean;
  data?: UserTokenInterface;
}
