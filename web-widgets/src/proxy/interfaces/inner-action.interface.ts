import { Method } from 'axios';

export interface InnerActionInterface  {
  readonly name: string;
  readonly description: string;
  readonly url: string;
  readonly method: Method;
  readonly roles: string[];
  readonly isClientAllowed?: boolean;
}
